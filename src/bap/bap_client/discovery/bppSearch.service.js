import { kafkaClusters, produceKafkaEvent } from "../../../shared/eda/kafka.js";
import { topics } from "../../../shared/eda/consumerInit/initConsumer.js";
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

class BppSearchService {
  /**
   *
   * @param {Object} context
   * @param {Object} req
   * @returns
   */
  async search(context = {}, req = {}) {
    try {
      const { criteria = {}, payment = {} } = req || {};

      const searchRequest = {
        context: context,
        message: {
          intent: {
            ...(criteria?.search_string && {
              item: {
                descriptor: {
                  name: criteria.search_string,
                },
              },
            }),
            ...((criteria?.provider_id ||
              criteria?.category_id ||
              criteria?.provider_name) && {
              provider: {
                ...(criteria?.provider_id && {
                  id: criteria?.provider_id,
                }),
                ...(criteria?.category_id && {
                  category_id: criteria.category_id,
                }),
                ...(criteria?.provider_name && {
                  descriptor: {
                    name: criteria?.provider_name,
                  },
                }),
              },
            }),
            ...((criteria?.pickup_location || criteria?.delivery_location) && {
              fulfillment: {
                type: "Delivery",
                ...(criteria?.pickup_location && {
                  start: {
                    location: {
                      gps: criteria?.pickup_location,
                    },
                  },
                }),
                ...(criteria?.delivery_location && {
                  end: {
                    location: {
                      gps: criteria?.delivery_location,
                    },
                  },
                }),
              },
            }),
            ...((criteria?.category_id || criteria?.category_name) && {
              category: {
                ...(criteria?.category_id && {
                  id: criteria?.category_id,
                }),
                ...(criteria?.category_name && {
                  descriptor: {
                    name: criteria?.category_name,
                  },
                }),
              },
            }),
            payment: {
              "@ondc/org/buyer_app_finder_fee_type":
                payment?.buyer_app_finder_fee_type ||
                process.env.BAP_FINDER_FEE_TYPE,
              "@ondc/org/buyer_app_finder_fee_amount":
                payment?.buyer_app_finder_fee_amount ||
                process.env.BAP_FINDER_FEE_AMOUNT,
            },
          },
        },
      };

      let topic = topics.CLIENT_API_BAP_SEARCH;

      await produceKafkaEvent(kafkaClusters.BAP, topic, searchRequest);

      let searchResponse = await redisSubscribe(
        searchRequest.context.message_id
      );

      return { context: context, message: searchResponse.message };
    } catch (err) {
      throw err;
    }
  }
}

export default BppSearchService;
