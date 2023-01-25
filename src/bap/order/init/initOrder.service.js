import { PROTOCOL_CONTEXT } from "../../../shared/utils/constants.js";
import BppInitService from "./bppInit.service.js";
import ContextFactory from "../../../shared/factories/ContextFactory.js";
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
    async initOrder(orderRequest, isMultiSellerRequest = false) {
        try {
            const { context: requestContext = {}, message: message = {} } = orderRequest || {};
            const { items = [], fulfillments = [], payment = {} } = message.order;
            const parentOrderId = requestContext?.transaction_id;

            const contextFactory = new ContextFactory();
            const context = contextFactory.create({
                domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
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

            const bppResponse = await bppInitService.init(
                requestContext.bpp_uri,
                context,
                message.order
            );

            return bppResponse;
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * init order
    * @param {Object} orderRequest
    * @param {Boolean} isMultiSellerRequest
    */
     async ONDCInitOrder(orderRequest, isMultiSellerRequest = false) {
        try {

            const { context: requestContext = {}, message = {} } = orderRequest;
            const { items = [], fulfillments = [], payment = {} } = message.order;
            
            //TODO
            //check all validations
            //transaction id to be same as select transaction id

            // var validation_flag = new BAPValidator().validateInit(orderRequest)

            // if(!validation_flag){
            //     return res.status(401)
                
            //     .json({ message : { 
            //             "ack": { "status": "NACK" },  
            //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
            //         })
            // }

            if (!(items?.length)) {
                return {
                    context : requestContext,
                    error: { message: "Empty order received" }
                };
            }

            const bppResponse = await bppInitService.ONDCInit(
                requestContext.bpp_uri,
                orderRequest
            );

            return bppResponse;
        }
        catch (err) {
            throw err;
        }
    }

    async ONDCInitOrderEvent(orderRequest) {
        try {

            const { context: requestContext = {}, message = {} } = orderRequest;
            const { items = [], fulfillments = [], payment = {} } = message.order;
            
            //TODO
            //check all validations
            //transaction id to be same as select transaction id

            // var validation_flag = new BAPValidator().validateInit(orderRequest)

            // if(!validation_flag){
            //     return res.status(401)
                
            //     .json({ message : { 
            //             "ack": { "status": "NACK" },  
            //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
            //         })
            // }

            if (!(items?.length)) {
                return {
                    context : requestContext,
                    error: { message: "Empty order received" }
                };
            }

            const bppResponse = await bppInitService.ONDCInit(
                requestContext.bpp_uri,
                orderRequest
            );

            // console.log("ONDCInitOrderEvent====> ", JSON.stringify(bppResponse));

            return bppResponse;
        }
        catch (err) {
            throw err;
        }
    }
}

export default InitOrderService;
