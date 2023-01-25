import {
  PAYMENT_COLLECTED_BY,
  PAYMENT_TYPES,
  PROTOCOL_CONTEXT,
} from "../../../shared/utils/constants.js";
import {protocolInit} from "../../../shared/utils/protocolApis/index.js";
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
class BppInitService {
  /**
   * bpp init order
   * @param {Object} context
   * @param {Object} order
   * @param {String} parentOrderId
   */
  async init(uri, context, order = {}) {
    try {
      const provider = order?.provider;

      const initRequest = {
        context: context,
        message: {
          order: {
            provider: provider,
            items:
              order?.items.map((item) => {
                return {
                  id: item?.id?.toString(),
                  quantity: item.quantity,
                };
              }) || [],
            add_ons: [],
            offers: [],
            billing: {
              ...order.billing,
              address: {
                ...order.billing.address,
                name: order.billing.name,
                area_code: order?.billing?.address?.areaCode,
              },
            },
            fulfillments: [
              {
                end: {
                  contact: {
                    email: order.delivery.email,
                    phone: order.delivery.phone,
                  },
                  location: {
                    ...order.delivery.location,
                    address: {
                      ...order.delivery.location.address,
                      name: order.delivery.name,
                      area_code: order?.delivery?.location?.address?.areaCode,
                    },
                  },
                },
                type: order.delivery.type,
                provider_id: provider.id,
              },
            ],
            payment: {
              type: order?.payment?.type,
              collected_by:
                order?.payment?.type === PAYMENT_TYPES["ON-ORDER"]
                  ? PAYMENT_COLLECTED_BY.BAP
                  : PAYMENT_COLLECTED_BY.BPP,
              "@ondc/org/buyer_app_finder_fee_type":
                order?.payment?.buyer_app_finder_fee_type ||
                process.env.BAP_FINDER_FEE_TYPE,
              "@ondc/org/buyer_app_finder_fee_amount":
                order?.payment?.buyer_app_finder_fee_amount ||
                process.env.BAP_FINDER_FEE_AMOUNT,
              "@ondc/org/ondc-withholding_amount": 0.0,
              "@ondc/org/ondc-return_window": 0.0,
              "@ondc/org/ondc-settlement_basis": "Collection",
              "@ondc/org/ondc-settlement_window": "P2D",
            },
          },
        },
      };

      let topic = process.env.KAFKA_TOPIC_PREFIX + '.' +topics.CLIENT_API_BAP_INIT

      await produceKafkaEvent(topic, initRequest)
           
      let response = await redisSubscribe(context.message_id) 


      // const response = await BAPApiCall(
      //   context.bap_uri,
      //   PROTOCOL_API_URLS.INIT,
      //   initRequest
      // );

      return { context: response.context, message: response.message };
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param {Object} context
   * @param {Object} req
   * @returns
   */
  async ONDCInit(uri, initRequest) {
    try {
      // const { criteria = {}, payment = {} } = req || {};

      let topic = topics.BAP_BPP_INIT

      await produceKafkaEvent(kafkaClusters.BG, topic, {uri, initRequest})
     
      produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, initRequest)


      let response = await redisSubscribe(initRequest.context.message_id)

      // const response = await protocolInit(uri, initRequest);

      // console.log("ONDCInit===>", JSON.stringify(response));
      return { context: response.context, message: response.message };
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  }

  async ONDCInitEvent({uri, initRequest}) {
    try {

      const response = await protocolInit(uri, initRequest);

      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default BppInitService;
