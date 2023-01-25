import { PROTOCOL_CONTEXT } from "../../../shared/utils/constants.js";
import { BAPApiCall, bppProtocolOnReturn, protocolReturn } from "../../../shared/utils/protocolApis/index.js";
import PROTOCOL_API_URLS from "../../../shared/utils/protocolApis/routes.js";
import { addOrUpdateOrderWithTransactionId, getOrderById, getOrderByTransactionId } from "../../../shared/db/dbService.js";
import { produceKafkaEvent, kafkaClusters } from '../../../shared/eda/kafka.js'
import { topics } from '../../../shared/eda/consumerInit/initConsumer.js'
import { redisSubscribe } from "../../../shared/database/redis.js";

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
class BppReturnService {

    /**
     * 
     * @param {Object} context 
     * @param {String} orderId 
     * @param {String} returnReasonId 
     * @returns 
     */
    async returnOrder(context, orderId, returnReasonId = "001") {
        try {

            const returnRequest = {
                context: context,
                message: {
                    order_id: orderId,
                    return_reason_id: returnReasonId
                }
            }

            let topic = process.env.KAFKA_TOPIC_PREFIX + '.' +topics.CLIENT_API_BAP_RETURN

            await produceKafkaEvent(topic, returnRequest)
                 
            let response = await redisSubscribe(returnRequest.context.message_id)       

            // const response = await BAPApiCall(context.bap_uri, PROTOCOL_API_URLS.RETURN, returnRequest);

            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }


    /**
     * 
     * @param {Object} context 
     * @param {String} orderId 
     * @param {String} returnReasonId 
     * @returns 
     */
     async ONDCReturnOrder(uri, context = {}, orderRequest = {}) {
        try {

            let topic = topics.BAP_BPP_RETURN

            await produceKafkaEvent(kafkaClusters.BG, topic, {uri, orderRequest})
            
            produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, orderRequest)
            
            let response = await redisSubscribe(orderRequest.context.message_id)
      
            // const response = await protocolReturn(context.bpp_uri, orderRequest);

            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }

    async ONDCReturnOrderEvent({uri, orderRequest = {}}) {
        try {

            const response = await protocolReturn(uri, orderRequest);

            return response;
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * bpp on return order
    * @param {Object} context
    * @param {Object} order
    * @param {String} parentOrderId
    */
     async bppOnReturnResponse(uri, orderRequest) {
        try {

            const context = orderRequest.context;
            const message = orderRequest.message;
            context.bpp_uri = process.env.BPP_URL;
            context.bpp_id = process.env.BPP_ID;
            context.action = PROTOCOL_CONTEXT.ON_RETURN;
            context.timestamp = new Date().toISOString();
            
            
            // const { context: requestContext = {}, message: message = {} } = orderRequest || {};
            // requestContext.bpp_uri = process.env.BPP_URL;
            // requestContext.bpp_id = process.env.BPP_ID;
            // requestContext.action = PROTOCOL_CONTEXT.ON_RETURN;
            // requestContext.timestamp = new Date().toISOString();

            const orderDetails = await getOrderByTransactionId(orderRequest.message.order_id);

            const returnRequest = {
              context: context,
              message: {
                "order":
                {
                  "id": orderDetails?.id,  // need to check case
                  "state": "Returnled",
                  "tags":{
                    "return_reason_id": orderRequest.message.return_reason_id
                  }
                }
              },
            };

            if (typeof orderDetails !== "undefined"){
                orderDetails.state = "Returnled";
            }


            await addOrUpdateOrderWithTransactionId(orderDetails?.transactionId, {
                ...orderDetails,
              });


            await bppProtocolOnReturn(uri, returnRequest);
        }
        catch (err) {
            throw err;
        }
    }

}

export default BppReturnService;
