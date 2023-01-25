import { v4 as uuidv4 } from 'uuid';
import { PAYMENT_COLLECTED_BY, PAYMENT_TYPES, PROTOCOL_PAYMENT } from "../../../../shared/utils/constants.js";
import { addOrUpdateOrderWithTransactionId, getCartByTransactionId } from '../../../../shared/db/dbService.js';
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

class BppConfirmService {

    /**
     * bpp confirm order
     * @param {Object} confirmRequest 
     * @returns 
     */
    async confirm(uri, confirmRequest = {}) {
        try {
            // console.log("Harnath 181818");

            let topic = topics.CLIENT_API_BAP_CONFIRM

            await produceKafkaEvent(kafkaClusters.BAP, topic, confirmRequest)
            // console.log("Harnath 191919");

            let confirmResponse = await redisSubscribe(confirmRequest.context.message_id)
            // console.log("Harnath 202020");

            return { context: confirmRequest.context, message: confirmResponse.message };
        }
        catch (err) {
            // console.log("Harnath 21212121");

            throw err;
        }
    }

    /**
     * bpp confirm order
     * @param {Object} context 
     * @param {Object} order 
     * @returns 
     */
    async confirmV1(uri, context, order = {}, createdBy) {
        try {
            // console.log("Harnath 10101010");

            let cartItem = await getCartByTransactionId(context?.transaction_id)
            if(context?.transaction_id!=cartItem?.transactionId){
                context.transaction_id= cartItem?.transactionId
            }
            if(!cartItem){
                return { status:false , message: "Empty cart. Please Add Items to your cart" };
            }
            // console.log("Harnath 12121212");

            const provider = cartItem?.order?.provider || {};
            const confirmRequest = {
                context: context,
                message: {
                    order: {
                        id: uuidv4(),
                        state: "Created",
                        billing: order.billing_info,
                        // delivery_info: order.delivery_info,
                        items: order?.items.map(item => {
                            return {
                                id: item.id,
                                quantity: item.quantity,
                                fulfillment_id: item.fulfillment_id,
                                product: order.product
                            };
                        }) || [],
                        // provider: {
                        //     id: provider?.id,
                        //     locations: provider?.locations?.map(location => {
                        //         return { id: location?.id }
                        //     })
                        // },
                        provider: order?.item?.[0]?.provider,
                        fulfillments: order.fulfillments,
                        // addOns: [],
                        // offers: [],
                        payment: {
                            params: {
                                // amount: order?.payment?.paid_amount?.toString(),
                                amount: order?.quote?.price?.value || "0",
                                currency: "INR",
                                transaction_id: order?.payment?.transaction_id//payment transaction id
                            },
                            status: order?.payment?.type === PAYMENT_TYPES["ON-ORDER"] ?
                                PROTOCOL_PAYMENT.PAID :
                                PROTOCOL_PAYMENT["NOT-PAID"],
                            type: order?.payment?.type,
                            collected_by: order?.payment?.collected_by || "BAP",
                            "@ondc/org/settlement_details": order?.payment["@ondc/org/settlement_details"] || 
                            [
                                {
                                    "settlement_counterparty": order?.payment?.type === PAYMENT_TYPES["ON-ORDER"] ? "seller-app" : "buyer-app",
                                    "settlement_phase": "sale-amount",
                                    "settlement_type": "upi",
                                    "upi_address": "gft@oksbi",
                                    "settlement_bank_account_no": "XXXXXXXXXX",
                                    "settlement_ifsc_code": "XXXXXXXXX",
                                    "beneficiary_name": "xxxxx",
                                    "bank_name": "xxxx",
                                    "branch_name": "xxxx"
                                }],

                            "@ondc/org/buyer_app_finder_fee_amount": order?.payment["@ondc/org/buyer_app_finder_fee_amount"],
                            "@ondc/org/buyer_app_finder_fee_type": order?.payment["@ondc/org/buyer_app_finder_fee_type"],
                            "@ondc/org/withholding_amount": order?.payment["@@ondc/org/withholding_amount"] || "0.0",
                            "@ondc/org/return_window": order?.payment["@ondc/org/return_window"] || 0,
                            "@ondc/org/settlement_basis": order?.payment["@ondc/org/settlement_basis"] || "Collection",
                            "@ondc/org/settlement_window": order?.payment["@ondc/org/settlement_window"] || "P2D",

                        },
                        // "documents": [{
                        //     "url": "",
                        //     "label": "Invoice"
                        // }],
                        quote: {
                            ...order?.quote
                        }
                    },
                }
            }
            // console.log("Harnath 131313");

            order["CreatedBy"] = cartItem?.CreatedBy
            order["bppDescriptor"] = cartItem?.order?.items?.[0]?.bppDescriptor
            order["order_category"] = cartItem?.order?.items?.[0]?.category_id
            order["bppProvider"] = cartItem?.order?.items?.[0]?.bppProvider || {}
            order["context"] = context || {}
            // console.log("Harnath 141414");

            order["items"].forEach(order_item => {
                (cartItem?.order?.items).forEach(cart_item => {
                    if (order_item?.id == cart_item?.id) {
                        order_item["category"] = cart_item?.category_id
                        order_item["descriptor"] = cart_item?.descriptor || {}
                        order_item["@ondc/org/cancellable"] = cart_item?.["@ondc/org/cancellable"]
                        order_item["@ondc/org/statutory_reqs_packaged_commodities"] = cart_item?.["@ondc/org/statutory_reqs_packaged_commodities"]
                        order_item["@ondc/org/returnable"] = cart_item?.["@ondc/org/returnable"]
                        order_item["@ondc/org/return_window"] = cart_item?.["@ondc/org/return_window"]
                        order_item["@ondc/org/seller_pickup_return"] = cart_item?.["@ondc/org/seller_pickup_return"]
                        order_item["@ondc/org/time_to_ship"] = cart_item?.["@ondc/org/time_to_ship"]
                        order_item["@ondc/org/available_on_cod"] = cart_item?.["@ondc/org/available_on_cod"]
                        order_item["@ondc/org/contact_details_consumer_care"] = cart_item?.["@ondc/org/contact_details_consumer_care"]
                        order_item["@ondc/org/statutory_reqs_prepackaged_food"] = cart_item?.["@ondc/org/statutory_reqs_prepackaged_food"]
                        order_item["@ondc/org/mandatory_reqs_veggies_fruits"] = cart_item?.["@ondc/org/mandatory_reqs_veggies_fruits"]
                        order_item["price"]=cart_item?.price
                    }
                });
            });
            // console.log("Harnath 1515");

            order["billing"] = order?.billing_info
            order["state"] = "Created"
            order["provider"]=provider||{}

            order.confirm= confirmRequest
            // console.log("Harnath 161616");

            addOrUpdateOrderWithTransactionId(context?.transaction_id, order)
            // console.log("Harnath 171717");

            // console.log(JSON.stringify(confirmRequest));
            return await this.confirm(uri, confirmRequest);
        }
        catch (err) {
            throw err;
        }
    }
}

export default BppConfirmService;
