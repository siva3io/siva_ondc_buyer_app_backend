import { PROTOCOL_CONTEXT } from "../../../shared/utils/constants.js";
import BppCancelService from "./bppCancel.service.js";
import ContextFactory from "../../../shared/factories/ContextFactory.js";
import CustomError from "../../../shared/lib/errors/custom.error.js";
import BAPValidator from "../../../shared/utils/validations/bap_validations/validations.js";
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

const bppCancelService = new BppCancelService();

class CancelOrderService {

    /**
    * cancel order
    * @param {Object} orderRequest
    */
    async cancelOrder(orderRequest) {
        try {

            // const orderDetails = await getOrderById(orderRequest.message.order_id);

            const { context: requestContext = {}, message: message = {} } = orderRequest || {};

            const contextFactory = new ContextFactory();
            // domain, country, city, action, bap 2, time stamp
            const context = contextFactory.create({
                domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.CANCEL,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bapId: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bapUrl: requestContext.bap_uri ? requestContext.bap_id : process.env.BAP_URL,
                });

            const { order_id, cancellation_reason_id } = message || {};

            if (!(context?.bpp_id)) {
                throw new CustomError("BPP Id is mandatory");
            }

            return await bppCancelService.cancelOrder(
                context,
                order_id,
                cancellation_reason_id
            );
        }
        catch (err) {
            throw err;
        }
    }


    /**
    * cancel order
    * @param {Object} orderRequest
    */
     async ONDCCancelOrder(orderRequest) {
        try {

            // const orderDetails = await getOrderById(orderRequest.message.order_id);

            const { context: requestContext = {}, message: order = {} } = orderRequest || {};

            if (!(requestContext?.bpp_id)) {
                throw new CustomError("BPP Id is mandatory");
            }

            var validation_flag = new BAPValidator().validateCancel(orderRequest)

            if(!validation_flag){
                return {
                    message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" }
                    } 
                }
            }

            return await bppCancelService.ONDCCancelOrder(
                requestContext.bpp_uri,
                requestContext,
                orderRequest
            );
        }
        catch (err) {
            throw err;
        }
    }

    async ONDCCancelOrderEvent(orderRequest) {
        try {

            // const orderDetails = await getOrderById(orderRequest.message.order_id);

            const { context: requestContext = {}, message: order = {} } = orderRequest || {};
            if (!(requestContext?.bpp_id)) {
                throw new CustomError("BPP Id is mandatory");
            }

            var validation_flag = new BAPValidator().validateCancel(orderRequest)

            if(!validation_flag){
                return {
                     message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } 
                    } 
                }
            }

            return await bppCancelService.ONDCCancelOrder(
                requestContext.bpp_uri,
                requestContext,
                orderRequest
            );
        }
        catch (err) {
            throw err;
        }
    }
}

export default CancelOrderService;
