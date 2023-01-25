import { v4 as uuidv4 } from 'uuid';
import { PROTOCOL_CONTEXT, PROTOCOL_VERSION } from '../../shared/utils/constants.js';
import {CITY_CODE} from "../utils/cityCode.js";

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
class ContextFactory {

    constructor(arg = {}) {
        let {
            domain = process.env.DOMAIN,
           //TODO: map city to city code. eg. Haydrabad
            country = process.env.COUNTRY,
            bapId = process.env.BAP_ID,
            bapUrl = process.env.BAP_URL,
            bppId = process.env.BPP_ID,
            bppUrl = process.env.BPP_URL,
            ttl = "P1M",
            city,
            state
        } = arg || {};

        this.domain = domain;
        this.country = country;
        this.bapId = bapId;
        this.bapUrl = bapUrl;
        this.ttl = ttl,
        this.bppId = bppId
        this.bppUrl = bppUrl
        this.timestamp = new Date()
    };

    getCity(city,state,cityCode){

        //map state and city to city code
        if (city){
            if (city.startsWith("std:")){
                return city
            }
        }
        
        if(cityCode){
            return cityCode
        }else{
            cityCode = process.env.CITY
            let cityMapping = CITY_CODE.find(x => {
                if( x.City === city && x.State === state){
                    return x
                }
            })

            if(cityMapping){
                if(cityMapping.Code){
                    cityCode = cityMapping.Code
                }
            }
            return cityCode
        }


    }

    create(contextObject = {}) {
        const {
            generatedTransactionId = uuidv4(), //FIXME: if ! found in args then create new
            messageId = uuidv4(),
            action = PROTOCOL_CONTEXT.SEARCH,
            bppId,
            bppUrl,
            city,state,cityCode

        } = contextObject || {};
        

        var ttl = contextObject?.ttl || null

        // if contextObject.
        
        if (ttl == null){
        
            switch (action) {
                case PROTOCOL_CONTEXT.CANCEL:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.RETURN:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.CONFIRM:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.INIT:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.SEARCH:
                    ttl = "PT30S"
                    break;                                
                case PROTOCOL_CONTEXT.TRACK:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.SUPPORT:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.STATUS:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.SELECT:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.UPDATE:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.RATING:
                    ttl = "PT30S"
                    break;                              
                case PROTOCOL_CONTEXT.ISSUE:
                    ttl = "PT30S"
                    break;
                case PROTOCOL_CONTEXT.SUPPORT:
                    ttl = "PT30S"
                    break;
                default:
                    ttl = process.env.TTL
            }
        }   
        // console.log("Harnath city", city);
        // console.log("Harnath state", state);
        // console.log("Harnath cityCode", cityCode);
        return {
            domain: contextObject.domain ? contextObject?.domain : this.domain,
            country: contextObject.country ? contextObject?.country : this.country,
            city: this.getCity(city,state,cityCode) ,
            action: action,
            core_version: PROTOCOL_VERSION.v_1_0_0,
            bap_id: contextObject.bap_id ? contextObject?.bap_id :this.bapId,
            bap_uri: contextObject.bap_uri ? contextObject?.bap_uri : this.bapUrl,
            transaction_id:contextObject.transactionId ? contextObject.transactionId :  generatedTransactionId,
            ttl: ttl,
            message_id: messageId,
            timestamp: this.timestamp,

            ...(bppId && { bpp_id: bppId}),
            ...(bppUrl && { bpp_uri: bppUrl})
        };

    }

    createBpp(contextObject = {}) {
        const {
            generatedTransactionId = uuidv4(), //FIXME: if ! found in args then create new
            messageId = uuidv4(),
            action = PROTOCOL_CONTEXT.SEARCH,
            bppId,
            bppUrl,
            city,state,cityCode

        } = contextObject || {};
        

        return {
            domain: contextObject.domain ? contextObject?.domain : this.domain,
            country: contextObject.country ? contextObject?.country : this.country,
            city: this.getCity(city,state,cityCode) ,
            action: action,
            core_version: PROTOCOL_VERSION.v_1_0_0,
            bap_id: contextObject.bap_id ? contextObject?.bap_id :this.bppId,
            bap_uri: contextObject.bap_uri ? contextObject?.bap_uri : this.bppUrl,
            transaction_id:contextObject.transactionId ? contextObject.transactionId :  generatedTransactionId,
            ttl: this.ttl,
            message_id: messageId,
            timestamp: this.timestamp,
            
            ...(bppId && { bpp_id: bppId}),
            ...(bppUrl && { bpp_uri: bppUrl})
        };

    }
}

export default ContextFactory;
