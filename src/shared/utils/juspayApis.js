import FetchRequest from "./FetchRequest.js";

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
 * Retrieve the order object associated with the order_id from juspay
 * @param {String} orderId 
 * @returns 
 */
const getJuspayOrderStatus = async (orderId) => {
    let apiCall = new FetchRequest(
        process.env.JUSPAY_BASE_URL,
        "/orders/" + orderId,
        "GET",
        {},
        { 
            "Accept": 'application/json',
            "x-merchantid": process.env.JUSPAY_MERCHANT_ID,
            "Authorization": 'Basic ' + Buffer.from(process.env.JUSPAY_API_KEY).toString('base64')
        }
    );

    let paymentDetails = {};

    await apiCall.send()
    .then(response => {
        if(response.status === "error" || response.error)
            throw response;
        else
            paymentDetails =  response;
    })
    .catch(err => {
        throw err;
    });

    return paymentDetails;
}

export { getJuspayOrderStatus };