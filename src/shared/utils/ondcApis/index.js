import FetchRequest from "../FetchRequest.js";
import { ONDC_API_URLS } from "./routes.js";

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
 * update order status
 * @param {Object} orderDetails 
 * @param {Object} user 
 */
const confirmOrder = async (orderDetails, user) => {
    let apiCall = new FetchRequest(
        process.env.ONDC_BASE_API_URL,
        ONDC_API_URLS.CONFIRM_ORDER,
        "POST",
        {...orderDetails},
        { 
            "Accept": 'application/json',
            "Authorization": 'Bearer ' + user.token
        }
    );

    await apiCall.send()
    .then(response => {
        // console.log(response);
    }).catch(error => {
        throw error;
    });

};

/**
 * Retrieve order details
 * @param {String} orderId 
 * @param {Object} user 
 * @returns 
 */
const getOrderDetails = async (orderId, user) => {
    let apiCall = new FetchRequest(
        process.env.ONDC_BASE_API_URL,
        ONDC_API_URLS.GET_ORDER,
        "GET",
        {},
        { 
            "Authorization": 'Bearer ' + user.token
        }
    );

    let orderDetails = {};

    await apiCall.send()
    .then(response => {
        if(!response.error)
            orderDetails = response;
        else
            throw response;
    }).catch(error => {
        throw error;
    });

    return orderDetails;
};

/**
 * Retrieve billing address 
 * @param {Object} user 
 * @returns 
 */
const getBillingAddress = async (user) => {
    let apiCall = new FetchRequest(
        process.env.ONDC_BASE_API_URL,
        ONDC_API_URLS.GET_BILLING_ADDRESS,
        "GET",
        {},
        { 
            "Authorization": 'Bearer ' + user.token
        }
    );
    let billingAddress = {};

    await apiCall.send()
    .then(response => {
        if(!response.error)
            billingAddress = response;
        else
            throw response;
    }).catch(error => {
        throw error;
    });

    return billingAddress;
};

/**
 * Retrieve delivery address
 * @param {Object} user 
 * @returns 
 */
const getDeliveryAddress = async (user) => {
    let apiCall = new FetchRequest(
        process.env.ONDC_BASE_API_URL,
        ONDC_API_URLS.GET_DELIVERY_ADDRESS,
        "GET",
        {},
        { 
            "Authorization": 'Bearer ' + user.token
        }
    );    
    let deliveryAddress = {}
    
    await apiCall.send()
    .then(response => {
        if(!response.error)
            deliveryAddress = response;
        else
            throw response;
    }).catch(error => {
        throw error;
    });

    return deliveryAddress;
};

export { confirmOrder, getBillingAddress, getDeliveryAddress, getOrderDetails };