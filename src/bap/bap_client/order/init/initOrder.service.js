import { PROTOCOL_CONTEXT } from "../../../../shared/utils/constants.js";
import BppInitService from "./bppInit.service.js";
import ContextFactory from "../../../../shared/factories/ContextFactory.js";
import { v4 as uuidv4} from 'uuid';

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

const bppInitService = new BppInitService();

class InitOrderService {
    /**
    * init order
    * @param {Object} orderRequest
    * @param {Boolean} isMultiSellerRequest
    */
    async initOrder(orderRequest, companyId, authToken, isMultiSellerRequest = false) {
        try {
            const { context: requestContext = {}, message: message = {} } = orderRequest || {};
            const { items = [], fulfillments = [], payment = {} } = message.order;
            // const parentOrderId = requestContext?.transaction_id;

            // console.log("Harnath orderRequest", orderRequest);
            // console.log("Harnath requestContext.city", requestContext.city);
            const contextFactory = new ContextFactory();
            const context = contextFactory.create({
                domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                // city: requestContext.city ? requestContext.city : process.env.CITY, 
                city: requestContext.city,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.INIT,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bapId: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bapUrl: requestContext.bap_uri ? requestContext.bap_id : process.env.BAP_URL,
                //...(!isMultiSellerRequest && { transactionId: requestContext?.transaction_id })
            });

            if (!(items?.length)) {
                return {
                    context,
                    error: { message: "Empty order received" }
                };
            }
            if (message.order?.delivery?.location?.address?.areaCode == "") {
                return {
                    context,
                    error: { message: "Delivery address not received" }
                };
            }
            if (message.order?.billing?.address?.areaCode == "") {
                return {
                    context,
                    error: { message: "Billing address not received" }
                };
            }

            console.log("Harnath context", context);
            
            
            const bppResponse = await bppInitService.init(
                requestContext.bpp_uri,
                context,
                message.order,
                companyId,
                authToken
            );

            return bppResponse;
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * init multiple orders
     * @param {Array} orders 
     * @param {Object} user
     */
    async initMultipleOrder(requestArray, companyId) {

        const initOrderResponse = await Promise.all(
            requestArray.map(async request => {
                try {
                    let itemId =  request?.message?.order?.items[0]?.id || "";
                    let name = request?.message?.order?.items[0]?.descriptor?.name || "";
                    let response = await this.initOrder(request, companyId);
                    response.id = itemId;
                    response.name = name;
                    
                    return response;
                }
                catch (err) {
                    throw err;
                }

            })
        );

        return initOrderResponse;
    }
}

export default InitOrderService;
