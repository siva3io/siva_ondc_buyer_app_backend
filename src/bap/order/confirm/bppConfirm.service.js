import { BAPApiCall, bppProtocolOnConfirm, protocolConfirm } from '../../../shared/utils/protocolApis/index.js';

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

class BppConfirmService {
    /**
     * 
     * @param {Object} context 
     * @param {Object} req 
     * @returns 
     */
     async ONDCConfirm(uri, confirmRequest) {
      try {
          // const { criteria = {}, payment = {} } = req || {};
          // console.log("Harnath fffffffff");

          let topic = topics.BAP_BPP_CONFIRM

          await produceKafkaEvent(kafkaClusters.BG, topic, {uri, confirmRequest})
          // console.log("Harnath ggggggggg");

          produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, confirmRequest)
            // console.log("Harnath hhhhhhhhhh");


          let response = await redisSubscribe(confirmRequest.context.message_id)    
          // console.log("Harnath iiiiiiiiiiiiiiiiiiiii");

        //   const response = await protocolConfirm(uri, confirmRequest);

          return { context: confirmRequest.context, message: response.message };
      }
      catch (err) {
          throw err;
      }
  }

  async ONDCConfirmEvent({uri, confirmRequest}) {
    try {

        const response = await protocolConfirm(uri, confirmRequest);

        return response;
    }
    catch (err) {
        throw err;
    }
}
}

export default BppConfirmService;
