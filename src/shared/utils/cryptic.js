import _sodium from 'libsodium-wrappers';
import _ from 'lodash'
import { SUBSCRIBER_TYPE } from './constants.js';
import { lookupBppById, lookupGateways } from './registryApis/index.js';
import { v4 as uuidv4 } from 'uuid';
import { getSubscriberType } from './registryApis/registryUtil.js';

/*
 Copyright (C) 2022 Eunimart Omnichannel Pvt Ltd. (www.eunimart.com)
 All rights reserved.
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License v3.0 as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License v3.0 for more details.
 You should have received a copy of the GNU Lesser General Public License v3.0
 along with this program.  If not, see <https://www.gnu.org/licenses/lgpl-3.0.html/>.
*/

export const createSigningString = async (message, created, expires) => {
    if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
    if (!expires) expires = (parseInt(created) + (1 * 60 * 60)).toString();

    await _sodium.ready;

    const sodium = _sodium;
    const digest = sodium.crypto_generichash(64, sodium.from_string(message));
    const digest_base64 = sodium.to_base64(digest, _sodium.base64_variants.ORIGINAL);

    const signing_string =
        `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`

    return { signing_string, created, expires };
}

export const signMessage = async (signing_string, privateKey) => {
    await _sodium.ready;
    const sodium = _sodium;

    const signedMessage = sodium.crypto_sign_detached(
        signing_string,
        sodium.from_base64(privateKey, _sodium.base64_variants.ORIGINAL)
    );
    return sodium.to_base64(signedMessage, _sodium.base64_variants.ORIGINAL);
}

export const createAuthorizationHeader = async (message, subscriber_id = process.env.BAP_ID, unique_key_id = process.env.BAP_UNIQUE_KEY_ID, private_key = process.env.BAP_PRIVATE_KEY) => {
    const {
        signing_string,
        expires,
        created
    } = await createSigningString(JSON.stringify(message));

    const signature = await signMessage(signing_string, private_key || "");

    // const subscriber_id = process.env.BAP_ID;
    // const unique_key_id = process.env.BAP_UNIQUE_KEY_ID;
    const header = `Signature keyId="${subscriber_id}|${unique_key_id}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`

    return header;
}

export const createKeyPair = async () => {
    await _sodium.ready;
    const sodium = _sodium;

    let { publicKey, privateKey } = sodium.crypto_sign_keypair();
    const publicKey_base64 = sodium.to_base64(publicKey, _sodium.base64_variants.ORIGINAL);
    const privateKey_base64 = sodium.to_base64(privateKey, _sodium.base64_variants.ORIGINAL);

    return { publicKey: publicKey_base64, privateKey: privateKey_base64 };
}


const getProviderPublicKey = async (providers, keyId) => {
    try {
        
        var provider = _.find(providers, ['unique_key_id', keyId]);
        if (!provider){
            provider = _.find(providers, ['ukId', keyId]);
        }
        return provider?.signing_public_key || false;

    } catch (e) {
        console.log(e);
        return false;
    }
}

const lookupRegistry = async (subscriber_id, unique_key_id, subscriber_type = SUBSCRIBER_TYPE.BAP) => {
    try {
        const response = await lookupBppById({
            type: getSubscriberType(subscriber_type),
            subscriber_id: subscriber_id
        });
        
        if (!response) {
            return false;
        }
        
        const public_key = await getProviderPublicKey(response, unique_key_id)
        
        if (!public_key)
            return false;
        
        return public_key;

    } catch (e) {
        return false;
    }
}

const remove_quotes = (a) => {
    return a.replace(/^["'](.+(?=["']$))["']$/, '$1');
}

const split_auth_header = (auth_header) => {
    const header = auth_header.replace('Signature ', '');
    let re = /\s*([^=]+)=([^,]+)[,]?/g;
    let m;
    let parts = {}
    while ((m = re.exec(header)) !== null) {
        if (m) {
            parts[m[1]] = remove_quotes(m[2]);
        }
    }
    return parts;
}

const verifyMessage = async (signedString, signingString, publicKey) => {
    try {
        await _sodium.ready;
        const sodium = _sodium;
        return sodium.crypto_sign_verify_detached(sodium.from_base64(signedString, _sodium.base64_variants.ORIGINAL), signingString, sodium.from_base64(publicKey, _sodium.base64_variants.ORIGINAL));
    } catch (error) {
        return false
    }
}

const verifyHeader = async (headerParts, body, public_key) => {
    const { signing_string } = await createSigningString(JSON.stringify(body), headerParts['created'], headerParts['expires']);
    const verified = await verifyMessage(headerParts['signature'], signing_string, public_key);
    return verified;
}

export const isSignatureValid = async (header, body, subscriber_type = SUBSCRIBER_TYPE.BAP) => {
    try {
        const headerParts = split_auth_header(header);

        console.log("BAP header to BPP", header);

        console.log("Subscriber type in the bpp side", subscriber_type);
        
        const keyIdSplit = headerParts['keyId'].split('|')
        
        const subscriber_id = keyIdSplit[0]
        const keyId = keyIdSplit[1]
        let public_key = ""
        
        if(subscriber_type == SUBSCRIBER_TYPE.BG){
            public_key = await lookupGateways(subscriber_id, keyId, subscriber_type)
            if(public_key.length > 0){
                public_key = public_key[0].signing_public_key
            }
        } else {
            public_key = await lookupRegistry(subscriber_id, keyId, subscriber_type)
        }
                
        const isValid = await verifyHeader(headerParts, body, public_key)
        return isValid
    } catch (e) {
        return false
    }
}


export const signRegistryRequest = async (request) => {
    
    let reqObj = [];

    if(request.country)
        reqObj.push(request.country);
    if(request.domain)
        reqObj.push(request.domain);
    if(request.type)
        reqObj.push(request.type);
    if(request.city)
        reqObj.push(request.city);
    if(request.subscriber_id)
        reqObj.push(request.subscriber_id);

    const signingString = reqObj.join("|");
    return await signMessage(signingString, process.env.BAP_PRIVATE_KEY || "");
}

export const formatRegistryRequest = async (request) => {
    const signature = await signRegistryRequest(request);

    return {
        sender_subscriber_id: process.env.BAP_ID,
        request_id: uuidv4(),
        timestamp: new Date().toISOString(),
        search_parameters: {
            ...request
        },
        signature: signature
    }
}