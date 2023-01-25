import { PROTOCOL_CONTEXT } from "../../../../shared/utils/constants.js";
import ContextFactory from "../../../../shared/factories/ContextFactory.js";
import BppSelectService from "./bppSelect.service.js";
import { v4 as uuidv4 } from 'uuid';

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

const bppSelectService = new BppSelectService();

class SelectOrderService {
    /**
    * select order
    * @param {Object} orderRequest
    */
    async selectOrder(orderRequest) {
        try {
            const { context: requestContext, message = {}} = orderRequest || {};
            const { order = {}, fulfillments = [],CreatedBy=orderRequest?.message?.CreatedBy } = message;

            const contextFactory = new ContextFactory();
            const context = contextFactory.create({
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.SELECT,
                transactionId: requestContext.transaction_id ? requestContext.transaction_id : requestContext?.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                cityCode :requestContext.city,
            });
            if (!(order?.items || order?.items?.length)) {
                return { 
                    context, 
                    error: { message: "Empty order received" }
                };
            }

            return await bppSelectService.select(
                requestContext.bpp_uri,
                context,
                { order, fulfillments, CreatedBy }
            );
        }
        catch (err) {
            // console.log("Error in SelectOrder (service.js)");
            console.log(err);
            throw err;
        }
    }
    
    /**
     * select multiple orders
     * @param {Array} requests 
     */
    async selectMultipleOrder(requestArray) {

        const selectOrderResponse = await Promise.all(
            requestArray.map(async request => {
                try {
                    let itemId =  request?.message?.order?.items[0]?.id || "";
                    let name = request?.message?.order?.items[0]?.descriptor?.name || "";
                    request.context.transaction_id = uuidv4()
                    let response = await this.selectOrder(request);
                    response.id = itemId;
                    response.name = name;
                    
                    return response;
                }
                catch (err) {
                    throw err;
                }
            })
        );

        return selectOrderResponse;
    }
}

export default SelectOrderService;
