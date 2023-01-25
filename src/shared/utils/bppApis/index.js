import HttpRequest from "../HttpRequest.js";
import BPP_API_URLS from "./routes.js";
import { createAuthorizationHeader } from "../cryptic.js";

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
 * confirm order
 * @param {String} bppUri 
 * @param {Object} order 
 */
const bppConfirm = async (bppUri, order) => {
    const authHeader = await createAuthorizationHeader(order);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.CONFIRM,
        "POST",
        order,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * cancel order
 * @param {String} bppUri 
 * @param {Object} order 
 */
const bppCancel = async (bppUri, order) => {
    const authHeader = await createAuthorizationHeader(order);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.CANCEL,
        "POST",
        order,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * initialize order
 * @param {String} bppUri 
 * @param {Object} order 
 */
const bppInit = async (bppUri, order) => {
    const authHeader = await createAuthorizationHeader(order);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.INIT,
        "POST",
        order,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * search
 * @param {String} bppUri 
 * @param {Object} message 
 */
const bppSearch = async (bppUri, message) => {
    const authHeader = await createAuthorizationHeader(message);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.SEARCH,
        "POST",
        message,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );
    const result = await apiCall.send();
    return result.data;
};

/**
 * track order
 * @param {String} bppUri 
 * @param {Object} trackRequest 
 */
const bppTrack = async (bppUri, trackRequest) => {
    const authHeader = await createAuthorizationHeader(trackRequest);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.TRACK,
        "POST",
        trackRequest,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * support
 * @param {String} bppUri 
 * @param {Object} supportRequest 
 */
const bppSupport = async (bppUri, supportRequest) => {
    const authHeader = await createAuthorizationHeader(supportRequest);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.SUPPORT,
        "POST",
        supportRequest,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * order status
 * @param {String} bppUri 
 * @param {Object} order 
 */
const bppOrderStatus = async (bppUri, order) => {
    const authHeader = await createAuthorizationHeader(order);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.STATUS,
        "POST",
        order,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * select order
 * @param {String} bppUri 
 * @param {Object} request 
 */
const bppSelect = async (bppUri, request) => {
    const authHeader = await createAuthorizationHeader(request);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.SELECT,
        "POST",
        request,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

/**
 * issue
 * @param {String} bppUri 
 * @param {Object} issue 
 */
 const bppIssue = async (bppUri, issue) => {
    const authHeader = await createAuthorizationHeader(issue);

    const apiCall = new HttpRequest(
        bppUri,
        BPP_API_URLS.ISSUE,
        "POST",
        issue,
        {
            "Authorization": authHeader,
            "Accept": "application/json"
        }
    );

    const result = await apiCall.send();
    return result.data;
};

export {
    bppCancel,
    bppConfirm,
    bppInit,
    bppSearch,
    bppOrderStatus,
    bppSupport,
    bppTrack,
    bppSelect,
    bppIssue,
};
