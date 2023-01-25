import { SUBSCRIBER_TYPE } from "../constants.js";
import HttpRequest from "../HttpRequest.js";
import { REGISTRY_SERVICE_API_URLS } from "./routes.js";
import { formatRegistryRequest } from './../cryptic.js';
import { getSubscriberType } from "./registryUtil.js";

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

/**
 * lookup bpp by Id
 * @param {Object} subscriberDetails 
 *  
 */
const lookupBppById = async ({
    subscriber_id, 
    type, 
    domain = process.env.DOMAIN, 
    country = process.env.COUNTRY
}) => {
    let request = {subscriber_id, type, domain, country};
    let registryBaseUrl = REGISTRY_SERVICE_API_URLS.LOOKUP;

    if(process.env.ENV_TYPE !== "STAGING") {
        request = await formatRegistryRequest({ 
            subscriber_id, type, domain, country
        });
        registryBaseUrl = REGISTRY_SERVICE_API_URLS.VLOOKUP;
    }
    const apiCall = new HttpRequest(
        // process.env.PROTOCOL_BASE_URL,
        process.env.REGISTRY_BASE_URL,
        registryBaseUrl,
        "POST",
        { ...request }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * lookup gateways
 * @param {Object} subscriberDetails 
 *  
 */
const lookupGateways = async () => {
    let registryBaseUrl = REGISTRY_SERVICE_API_URLS.LOOKUP;
    let request = {
        type: getSubscriberType(SUBSCRIBER_TYPE.BG),
        domain: process.env.DOMAIN, 
        country: process.env.COUNTRY
    };
    
    if(process.env.ENV_TYPE !== "STAGING") {
        request = await formatRegistryRequest({ 
            type: getSubscriberType(SUBSCRIBER_TYPE.BG),
            country: process.env.COUNTRY,
            domain: process.env.DOMAIN,
        });
        registryBaseUrl = REGISTRY_SERVICE_API_URLS.VLOOKUP;
    }


    const apiCall = new HttpRequest(
        process.env.REGISTRY_BASE_URL,
        registryBaseUrl,
        "POST",
        {
            ...request
        }
    );

    const result = await apiCall.send();
    return result.data;
};

export { lookupBppById, lookupGateways };
