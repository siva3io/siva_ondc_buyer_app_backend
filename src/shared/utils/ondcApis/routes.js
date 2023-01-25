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

const CONFIRM_ORDER = "/client/v2/confirm_order";
const ON_CONFIRM_ORDER = "/client/v2/on_confirm_order?messageIds";
const GET_BILLING_ADDRESS = "/client/v1/billing_details";
const GET_DELIVERY_ADDRESS = "/client/v1/delivery_address";
const GET_ORDER = "/client/v1/order";


export const ONDC_API_URLS = {
    CONFIRM_ORDER,
    GET_BILLING_ADDRESS,
    GET_DELIVERY_ADDRESS,
    GET_ORDER,
    ON_CONFIRM_ORDER
}
