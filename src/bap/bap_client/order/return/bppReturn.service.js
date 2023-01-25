import { produceKafkaEvent, kafkaClusters } from '../../../../shared/eda/kafka.js'
import { topics } from '../../../../shared/eda/consumerInit/initConsumer.js'
import { redisSubscribe } from "../../../../shared/database/redis.js";

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

            let topic = topics.CLIENT_API_BAP_RETURN
            await produceKafkaEvent(kafkaClusters.BAP, topic, returnRequest)
                 
            let response = await redisSubscribe(returnRequest.context.message_id)       

            // const response = await BAPApiCall(context.bap_uri, PROTOCOL_API_URLS.RETURN, returnRequest);
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }
}

export default BppReturnService;
