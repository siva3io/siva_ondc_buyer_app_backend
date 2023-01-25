import { SUBSCRIBER_TYPE } from './../constants.js';

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

export const getSubscriberUrl = (subscriberDetails = []) => {
    try {
        const subscriber = subscriberDetails?.[0];
        const subscriber_id = subscriber?.subscriber_id;
        const subscriber_url = subscriber?.network_participant?.[0]?.subscriber_url;

        if ((process.env.ENV_TYPE !== "STAGING" && subscriber_id && subscriber_url) || 
            (process.env.ENV_TYPE === "STAGING" && subscriber?.subscriber_url))
            return process.env.ENV_TYPE !== "STAGING" ?
                `https://${subscriber_id}${subscriber_url}` :
                subscriber?.subscriber_url;
        else
            throw new Error("Invalid subscriber url");
    }
    catch (err) {
        throw err;
    }
}

export const getSubscriberType = (type) => {
    const TYPE_MAP = {
        [SUBSCRIBER_TYPE.BAP]: process.env.ENV_TYPE === "STAGING" ? "BAP" : "buyerApp",
        [SUBSCRIBER_TYPE.BPP]: process.env.ENV_TYPE === "STAGING" ? "BPP" : "sellerApp",
        [SUBSCRIBER_TYPE.BG]: process.env.ENV_TYPE === "STAGING" ? "BG" : "gateway"
    };

    return TYPE_MAP?.[type];
}