import { protocolSupport } from "../../shared/utils/protocolApis/index.js";
import { produceKafkaEvent, kafkaClusters } from '../../shared/eda/kafka.js'
import { topics } from '../../shared/eda/consumerInit/initConsumer.js'
import { redisSubscribe } from "../../shared/database/redis.js";

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

class BppSupportService {
     /**
     * support
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
    async ONDCSupport(uri, supportRequest) {
        try {     

            let topic = topics.BAP_BPP_SUPPORT

            await produceKafkaEvent(kafkaClusters.BG, topic, {uri, supportRequest})
           
            produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, supportRequest)

            let response = await redisSubscribe(supportRequest.context.message_id)
        
            // const response = await protocolSupport(uri, supportRequest);
            
            return { context: response.context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }

    async ONDCSupportEvent({uri, supportRequest}) {
        try {       
            const response = await protocolSupport(uri, supportRequest);
            
            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

export default BppSupportService;
