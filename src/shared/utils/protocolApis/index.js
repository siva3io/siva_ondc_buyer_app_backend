import fetch from 'node-fetch';

import HttpRequest from "../HttpRequest.js";
import PROTOCOL_API_URLS from "./routes.js";
import { createAuthorizationHeader } from "../cryptic.js";
import { FindIssue, UpsertOnIssue } from '../../db/dbService.js';
import CustomLogs from '../customLogs.js';
import { getSubscriberType } from '../registryApis/registryUtil.js';
import { PROTOCOL_CONTEXT, SUBSCRIBER_TYPE } from '../constants.js';

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
 * order confirm
 * @param {Object} data 
 * @returns 
 */
const protocolConfirm = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.CONFIRM,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.CONFIRM, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on confirm order
 * @param {String} messageId 
 */
const onOrderConfirm = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_CONFIRM + "?messageId=" + messageId,
        "get",
    );
    

    const result = await apiCall.send();
    return result.data;
};

/**
 * order cancel
 * @param {Object} data 
 * @returns 
 */
const protocolCancel = async (url, data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(
        url, 
        PROTOCOL_API_URLS.CANCEL,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.CANCEL, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * order return
 * @param {Object} data 
 * @returns 
 */
const protocolReturn = async (url, data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(
        url, 
        PROTOCOL_API_URLS.RETURN,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
}

/**
 * on cancel order
 * @param {String} messageId 
 */
const onOrderCancel = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_CANCEL + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * on return order
 * @param {String} messageId 
 */
const onOrderReturn = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_CANCEL + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * init order
 * @param {Object} data 
 * @returns 
 */
const protocolInit = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.INIT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.INIT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on init order
 * @param {String} messageId 
 */
const onOrderInit = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_INIT + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * search
 * @param {Object} data 
 * @returns 
 */
const protocolSearch = async (data) => {

    const authHeader = await createAuthorizationHeader(data);
    
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.SEARCH,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.SEARCH, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on search products
 * @param {Object} query 
 */
const onSearch = async (query) => {

    const queryString = Object.keys(query).map(key => {
        if (typeof key !== "undefined" && typeof query[key] !== "undefined")
            return encodeURIComponent(key) + '=' + encodeURIComponent(query[key]);
    }).join('&');

    const apiCall = await fetch(
        process.env.PROTOCOL_BASE_URL
        + "/" +
        PROTOCOL_API_URLS.ON_SEARCH + "?" + queryString
    );

    const result = await apiCall.json();
    return result;
};

/**
 * track order
 * @param {Object} data 
 * @returns 
 */
const protocolTrack = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.TRACK,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.TRACK, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on track order
 * @param {String} messageId 
 */
const onOrderTrack = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_TRACK + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * order support
 * @param {Object} data 
 * @returns 
 */
const protocolSupport = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.SUPPORT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.SUPPORT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * order rate
 * @param {Object} data 
 * @returns 
 */
const protocolRating = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);
    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.RATING,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    const result = await apiCall.send();
    return result.data;
}

/**
 * on support
 * @param {String} messageId 
 */
const onOrderSupport = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_SUPPORT + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * on support
 * @param {String} messageId 
 */
 const bppProtocolOnRating = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_RATING,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_RATING, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_RATING, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_RATING, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    const result = await apiCall.send();
    return result.data;
}

/**
 * order status
 * @param {Object} data 
 * @returns 
 */
const protocolOrderStatus = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.STATUS,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.STATUS, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on order status
 * @param {String} messageId 
 */
const onOrderStatus = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_STATUS + "?messageId="+ messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * on order status
 * @param {String} messageId
 */
const protocolUpdate = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.UPDATE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.UPDATE, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
};

/**
 * on order update status
 * @param {String} messageId
 */
const onUpdateStatus = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_UPDATE+ "?messageId="+ messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * quote order
 * @param {Object} data 
 * @returns 
 */
const protocolSelect = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data);
    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.SELECT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.SELECT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on quote order
 * @param {String} messageId 
 */
const onOrderSelect = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_SELECT + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};


/**
 * on issue
 * @param {String} messageId 
 */
 const onOrderIssue = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_S + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * on quote order
 * @param {String} messageId 
 */
 const onOrderRating = async (messageId) => {
    const apiCall = new HttpRequest(
        process.env.PROTOCOL_BASE_URL,
        PROTOCOL_API_URLS.ON_RATE + "?messageId=" + messageId,
        "get",
    );

    const result = await apiCall.send();
    return result.data;
};




/**
 * bpp search
 * @param {Object} data 
 * @returns 
 */
const bppProtocolOnSearch = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    
    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_SEARCH,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_SEARCH, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();

    return result.data;
}

/**
 * Rating Categories
 * @param {Object} data 
 * @returns 
 */
 const protocolGetRatingCategories = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.GET_RATING_CATEGORIES,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }

    const result = await apiCall.send();
    return result.data;
}

/**
 * Feedback Categories
 * @param {Object} data 
 * @returns 
 */
 const protocolGetFeedbackCategories = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.GET_FEEDBACK_CATEGORIES,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }


    const result = await apiCall.send();
    return result.data;
}

/**
 * Feedback Form
 * @param {Object} data 
 * @returns 
 */
 const protocolGetFeedbackForm = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.GET_FEEDBACK_FORM,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.GET_FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    const result = await apiCall.send();
    return result.data;
}


/**
 * Issue
 * @param {Object} data 
 * @returns 
 */
 const protocolIssue = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ISSUE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
}


/**
 * bpp rating categories
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolRatingCategories = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);


    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.RATING_CATEGORIES,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.RATING_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    const result = await apiCall.send();

    return result.data;
}

/**
 * bpp feedback categories
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolFeedbackCategories = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.FEEDBACK_CATEGORIES,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_CATEGORIES, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    
    const result = await apiCall.send();

    return result.data;
}

/**
 * bpp feedback categories
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolFeedbackForm = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.FEEDBACK_FORM,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    switch(uri){
        case(process.env.BAP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BAP))  
            break;          
        }
        case(process.env.BPP_URL):{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
        default:{
            CustomLogs.writeRatingLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.FEEDBACK_FORM, getSubscriberType(SUBSCRIBER_TYPE.BAP))
        }
    }
    const result = await apiCall.send();

    return result.data;
}


/**
 * quote order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnSelect = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_SELECT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_SELECT, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * init order
 * @param {Object} data 
 * @returns 
 */
const bppProtocolOnInit = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_INIT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_INIT, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on cancel order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnCancel = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_CANCEL,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    
    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_CANCEL, getSubscriberType(SUBSCRIBER_TYPE.BPP))
    const result = await apiCall.send();
    
    // console.log("result", result)
    return result.data;
}

/**
 * on return order
 * @param {Object} data 
 * @returns 
 */
const bppProtocolOnReturn = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_RETURN,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    const result = await apiCall.send();
    return result.data;
}





/**
 * support order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnSupport = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_SUPPORT,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_SUPPORT, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * track order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnTrack = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_TRACK,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_TRACK, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnUpdate = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_UPDATE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_UPDATE, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}
    
/**
 * on Confirm order
 * @param {Object} data 
 * @returns 
 */

const bppProtocolOnConfirm = async (uri, data) => {
    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_CONFIRM,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    
    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_CONFIRM, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnStatus = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_STATUS,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeRetailLogsToONDC(JSON.stringify(data), PROTOCOL_CONTEXT.ON_STATUS, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

const bppProtocolOnIssueDefault = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_ISSUE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), uri, getSubscriberType(SUBSCRIBER_TYPE.BPP))
    const result = await apiCall.send();
    return result.data;
}


/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
 const bppProtocolOnIssue = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY);


    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_ISSUE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), uri, getSubscriberType(SUBSCRIBER_TYPE.BPP))
    const result = await apiCall.send();
    // await UpsertOnIssue(data)
    // const issue_data = await FindIssue(data?.message?.issue_resolution_details?.issue?.id)
    // const parent_data = await FindIssue(issue_data?.parent_issue_id)
    // var condition = parent_data?.parent_issue_id && (parent_data?.seller || parent_data?.buyer)
    // if (condition != undefined){
    //     data.context = parent_data?.on_context
    //     data.message.issue_resolution_details.issue.id = parent_data?.issue_id
    //     if (parent_data?.seller && parent_data?.buyer){
    //     switch(parent_data?.buyer){
    //         case process.env.BAP_URL:{
    //             await bapProtocolOnIssue(parent_data?.buyer,data)
    //             break;
    //         }
    //         case process.env.BPP_URL:{
    //             await bppProtocolOnIssue(parent_data?.buyer,data)
    //             break;
    //         }
    //         default:{
    //         }
    //     }
    // }
    // else {
    //     await UpsertOnIssue(data)
    // }
    // }
   
    return result.data;
}

const ProtocolOnIssueStatus = async (uri, data) => {

    var authHeader
    switch(data?.context?.bap_uri){
        case process.env.BAP_URL:{
            authHeader = await createAuthorizationHeader(data, process.env.BAP_ID, process.env.BAP_UNIQUE_KEY_ID, process.env.BAP_PRIVATE_KEY)//.then(response =>{
            //     authHeader=response
            // });
            break;
        }
        case process.env.BPP_URL:{
            authHeader = await createAuthorizationHeader(data, process.env.BPP_ID, process.env.BPP_UNIQUE_KEY_ID, process.env.BPP_PRIVATE_KEY)//.then(response =>{
            //     authHeader=response
            // });
            break;
        }
    }
    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_ISSUE_STATUS,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    switch(data?.context?.bap_uri){
        case process.env.BAP_URL:{
            CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), "on_issue_status", getSubscriberType(SUBSCRIBER_TYPE.BAP))
            break;
        }
        case process.env.BPP_URL:{
            CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), "on_issue_status", getSubscriberType(SUBSCRIBER_TYPE.BPP))
            break;
        }
    }

    const result = await apiCall.send();
    return result.data;
}


const bapProtocolOnIssueDefault = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BAP_ID, process.env.BAP_UNIQUE_KEY_ID, process.env.BAP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_ISSUE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), uri, getSubscriberType(SUBSCRIBER_TYPE.BAP))
    const result = await apiCall.send();
    return result.data;
}

/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
const bapProtocolOnIssue = async (uri, data) => {

    const authHeader = await createAuthorizationHeader(data, process.env.BAP_ID, process.env.BAP_UNIQUE_KEY_ID, process.env.BAP_PRIVATE_KEY);

    const apiCall = new HttpRequest(uri,
        PROTOCOL_API_URLS.ON_ISSUE,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), uri, getSubscriberType(SUBSCRIBER_TYPE.BAP))
    const result = await apiCall.send();
    // await UpsertOnIssue(data)
    // const issue_data = await FindIssue(data?.message?.issue_resolution_details?.issue?.id)
    // const parent_data = await FindIssue(issue_data?.parent_issue_id)
    // var condition = parent_data?.parent_issue_id && (parent_data?.seller || parent_data?.buyer)
    // if (condition)
    // {
    //     data.context = parent_data?.on_context
    //     data.message.issue_resolution_details.issue.id = parent_data?.issue_id
    //     if (parent_data?.seller && parent_data?.buyer){
    //     switch(parent_data?.buyer){
    //         case process.env.BAP_URL:{
    //             await bapProtocolOnIssue(parent_data?.buyer,data)
    //             break;
    //         }
    //         case process.env.BPP_URL:{
    //             await bppProtocolOnIssue(parent_data?.buyer,data)
    //             break;
    //         }
    //         default:{
    //         }
    //     }
    // }
    // else {
    //     await UpsertOnIssue(data)
    // }
    // }
    return result.data;
}

/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
 const BAPApiCall = async (uri, url_type ,data) => {

    const authHeader = await createAuthorizationHeader(data);

    const apiCall = new HttpRequest(uri,
        url_type,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
}

/**
 * on update order
 * @param {Object} data 
 * @returns 
 */
 const CallWebhook = async (url_type ,data) => {

    const url = "https://edads.siva3.io/webhooks/ondc"

    const apiCall = new HttpRequest(url,
        url_type,
        "POST",
        {
            ...data
        },
        {
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
}

/**
* search
* @param {Object} data 
* @returns 
*/
const commonProtocolAPIForLsp = async (baseUrl,url, data, subscriberId, uniqueKeyId, privateKey) => {

    const authHeader = await createAuthorizationHeader(data, subscriberId, uniqueKeyId, privateKey);
    const apiCall = new HttpRequest(
        baseUrl,
        url,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeLSPLogsToONDC(JSON.stringify(data), url, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}
const commonProtocolAPIForIGM = async (baseUrl,url, data, subscriberId, uniqueKeyId, privateKey) => {

    const authHeader = await createAuthorizationHeader(data, subscriberId, uniqueKeyId, privateKey);
    const apiCall = new HttpRequest(
        baseUrl,
        url,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), url, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

const commonProtocolAPIForIGMBAP = async (baseUrl,url, data, subscriberId, uniqueKeyId, privateKey) => {

    const authHeader = await createAuthorizationHeader(data, subscriberId, uniqueKeyId, privateKey);
    const apiCall = new HttpRequest(
        baseUrl,
        url,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), url, getSubscriberType(SUBSCRIBER_TYPE.BAP))

    const result = await apiCall.send();
    return result.data;
}

const commonProtocolAPIForIGMBPP = async (baseUrl,url, data, subscriberId, uniqueKeyId, privateKey) => {

    const authHeader = await createAuthorizationHeader(data, subscriberId, uniqueKeyId, privateKey);
    const apiCall = new HttpRequest(
        baseUrl,
        url,
        "POST",
        {
            ...data
        },
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    CustomLogs.writeIGMLogsToONDC(JSON.stringify(data), url, getSubscriberType(SUBSCRIBER_TYPE.BPP))

    const result = await apiCall.send();
    return result.data;
}

export {
    commonProtocolAPIForLsp,
    commonProtocolAPIForIGM,
    
    onOrderCancel,
    onOrderReturn,
    onOrderConfirm,
    onOrderInit,
    onSearch,
    onOrderStatus,
    onOrderSupport,
    onOrderTrack,
    onOrderSelect,
    onOrderIssue,
    protocolCancel,
    protocolReturn,
    protocolConfirm,
    protocolInit,
    protocolSearch,
    protocolOrderStatus,
    protocolSupport,
    protocolTrack,
    protocolSelect,
    protocolUpdate,
    onUpdateStatus,
    bppProtocolOnSearch,
    bppProtocolOnSelect,
    bppProtocolOnInit,
    bppProtocolOnCancel,
    bppProtocolOnReturn,
    bppProtocolOnSupport,
    bppProtocolOnTrack,
    bppProtocolOnUpdate,
    bppProtocolOnConfirm,
    bppProtocolOnStatus,
    BAPApiCall,
    CallWebhook,
    protocolRating,
    bppProtocolOnRating,
    onOrderRating,
    bppProtocolRatingCategories,
    protocolGetRatingCategories,
    bppProtocolFeedbackCategories,
    protocolGetFeedbackCategories,
    bppProtocolFeedbackForm,
    protocolGetFeedbackForm,
    protocolIssue,
    bppProtocolOnIssue,
    bapProtocolOnIssue,
    ProtocolOnIssueStatus,
    bppProtocolOnIssueDefault,
    bapProtocolOnIssueDefault,
    commonProtocolAPIForIGMBPP,
    commonProtocolAPIForIGMBAP
};
