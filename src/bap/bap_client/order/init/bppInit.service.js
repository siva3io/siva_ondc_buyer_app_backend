import {
  PAYMENT_COLLECTED_BY,
  PAYMENT_TYPES,
  PAYMENT_COLLECTED_BY_STATUS,
} from "../../../../shared/utils/constants.js";
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

class BppInitService {
  /**
   * bpp init order
   * @param {Object} context
   * @param {Object} order
   * @param {String} parentOrderId
   */
  async init(uri, context, order = {}, companyId = 1, authToken = "") {
    var is_collector
    try {
      const provider = order?.provider;

      var uri = process.env.EUNIMART_CORE_HOST;
      var baseURL = process.env.USER_COMPANY_DETAILS_BASE_PATH + companyId.toString();
      try {
        const apiCall = new HttpRequest(uri,
            baseURL,
            "GET",
            {},
            {
                "Authorization": authToken,
                "Accept": "application/json"
            }
        );
        const company_result = await apiCall.send();
        is_collector = company_result?.data?.data?.ondc_details?.is_collector || true
        
      } catch (error) {
        is_collector = true
      }
      
      var collected_by =  PAYMENT_COLLECTED_BY.EMPTY
      var collected_by_status =  PAYMENT_COLLECTED_BY_STATUS.EMPTY
      
      if (is_collector == true){
        collected_by =  PAYMENT_COLLECTED_BY.BAP
        collected_by_status =  PAYMENT_COLLECTED_BY_STATUS.ASSERT
      }
      
      const initRequest = {
        context: context,
        message: {
          order: {
            // provider: provider,
            provider: {
              id: provider?.id,
              locations: provider?.locations || []
              // locations: [
              //   {
              //     id: provider?.id
              //   }
              // ]
            },
            items:
              order?.items.map((item) => {
                return {
                  id: item?.id?.toString(),
                  fulfillment_id:item?.fulfillment_id,
                  quantity: item?.quantity,
                };
              }) || [],
            // add_ons: [],
            // offers: [],
            billing: {
              ...order.billing,
              address: {
                ...order.billing.address,
                // name: order.billing.name,
                // area_code: order?.billing?.address?.areaCode || "500081",
              },
            },
            fulfillments: [
            ],
            tags: [ 
            {
              code: "bap_terms_fee",
              list: [
                {
                  code: "finder_fee_type",
                  value: order?.payment?.buyer_app_finder_fee_type || process.env.BAP_FINDER_FEE_TYPE,
                },
                {
                  code: "finder_fee_amount",
                  value: order?.payment?.buyer_app_finder_fee_amount || process.env.BAP_FINDER_FEE_AMOUNT
                }
              ]
            }
          ],            
            // payment: {
            //   type: order?.payment?.type,
            //   collected_by: collected_by,
            //   "@ondc/org/ondc-collected_by_status": collected_by_status,
            //   "@ondc/org/buyer_app_finder_fee_type":
            //     order?.payment?.buyer_app_finder_fee_type ||
            //     process.env.BAP_FINDER_FEE_TYPE,
            //   "@ondc/org/buyer_app_finder_fee_amount":
            //     order?.payment?.buyer_app_finder_fee_amount ||
            //     process.env.BAP_FINDER_FEE_AMOUNT,
            //   "@ondc/org/ondc-withholding_amount": 0.0,
            //   "@ondc/org/ondc-return_window": 0.0,
            //   "@ondc/org/ondc-settlement_basis": "Collection",
            //   "@ondc/org/ondc-settlement_window": "P2D",
            //   "@ondc/org/settlement_details": [
            //     {
            //       "settlement_counterparty": order?.payment?.type === PAYMENT_TYPES["ON-ORDER"] ? "seller-app" : "buyer-app",
            //       "settlement_phase": "sale-amount",
            //       "settlement_type": "upi",
            //       "upi_address": "gft@oksbi",
            //       "settlement_bank_account_no": "XXXXXXXXXX",
            //       "settlement_ifsc_code": "XXXXXXXXX",
            //       "beneficiary_name": "xxxxx",
            //       "bank_name": "xxxx",
            //       "branch_name": "xxxx"
            //     }],
            // },
            
            // documents:[{
            //             "url": "",
            //             "label": "Invoice"}],
          },
        },
      };

      for (const fulfillment of order.fulfillments){
        initRequest.message.order.fulfillments.push({
          id:fulfillment?.id,
          tracking:fulfillment?.tracking,
          end: {
            contact: {
              email: order.delivery.email,
              phone: order.delivery.phone,
            },
            location: {
              ...order.delivery.location,
              address: {
                ...order.delivery.location.address,
                // name: order.delivery.name,
                // area_code: order?.delivery?.location?.address?.area_code,
              },
            },
          },
          type: order.delivery.type,
          provider_id: provider.id,
        })
      }

      let topic = topics.CLIENT_API_BAP_INIT

      await produceKafkaEvent(kafkaClusters.BAP, topic, initRequest)
           
      let response = await redisSubscribe(context.message_id) 
      response.context.city = context.city
      return { context: response.context, message: response.message };
    } catch (err) {
      throw err;
    }
  }
}

export default BppInitService;
