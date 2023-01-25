import { UpsertBapUserCartItem } from "../../../../shared/db/dbService.js";
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
class BppSelectService {
  /**
   * bpp select order
   * @param {Object} context
   * @param {Object} order
   * @returns
   */
  async select(uri, context, orderRequest = {}) {
    try {
      const { order = {}, fulfillments = [] } = orderRequest || {};

      const provider = order?.provider;
      const CreatedBy = orderRequest?.CreatedBy;

      const selectRequest = {
        context: context,
        message: {
          order: {
            items:
              order.items.map((cartItem) => {
                return {
                  id: cartItem?.id?.toString(),
                  location_id: cartItem?.location_id,
                  quantity: { count: cartItem?.quantity },
                };
              }) || [],
            provider: {
              id: provider?.id,
              locations: provider.locations.map((location) => {
                return { id: location.id };
              }),
            },
            fulfillments:
              fulfillments && fulfillments.length ? [...fulfillments] : []
          },
        },
      };

      let itemId = order?.items?.[0]?.id
      let cart = {
        order : order,
        context: context,
        select: selectRequest,
        transactionId: context?.transaction_id
      }

      let filterQuery = {
        CreatedBy : CreatedBy,
        itemId : itemId
      }
      await UpsertBapUserCartItem(filterQuery, cart);
      console.log("Cart upserted successfully");

      let topic = topics.CLIENT_API_BAP_SELECT

      await produceKafkaEvent(kafkaClusters.BAP, topic, selectRequest)

      let selectResponse = await redisSubscribe(selectRequest.context.message_id)

      return { context: context, message: selectResponse.message };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}

export default BppSelectService;
