import { JUSPAY_PAYMENT_STATUS, PAYMENT_TYPES, PROTOCOL_CONTEXT, PROTOCOL_PAYMENT, SUBSCRIBER_TYPE } from "../../../shared/utils/constants.js";
import ContextFactory from "../../../shared/factories/ContextFactory.js";
import BppConfirmService from "./bppConfirm.service.js";
import JuspayService from "../../bap_client/payment/juspay.service.js";
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

const bppConfirmService = new BppConfirmService();
const juspayService = new JuspayService();

class ConfirmOrderService {

    /**
     * 
     * @param {Array} items 
     * @returns Boolean
     */
    areMultipleBppItemsSelected(items) {
        return items ? [...new Set(items.map(item => item.bpp_id))].length > 1 : false;
    }

    /**
     * 
     * @param {Array} items 
     * @returns Boolean
     */
    areMultipleProviderItemsSelected(items) {
        return items ? [...new Set(items.map(item => item.provider.id))].length > 1 : false;
    }

    /**
     * 
     * @param {Object} payment
     * @param {String} orderId
     * @param {Boolean} confirmPayment
     * @returns Boolean
     */
    async arePaymentsPending(payment, orderId, total, confirmPayment = true) {
        if (payment?.type !== PAYMENT_TYPES["ON-ORDER"])
            return false;

        // const paymentDetails = (confirmPayment && await juspayService.getOrderStatus(orderId)) || {};

        // return payment == null ||
        //     payment.paid_amount <= 0 ||
        //     total <= 0 ||
        //     (
        //         confirmPayment &&
        //         ((process.env.NODE_ENV === "prod" &&
        //             total !== paymentDetails?.amount) ||
        //             paymentDetails?.status !== JUSPAY_PAYMENT_STATUS.CHARGED.status)
        //     );
        return false
    }

    /**
    * confirm order
    * @param {Object} orderRequest
    */
    async confirmOrder(orderRequest) {
        try {
            const { context: requestContext, message: order = {} } = orderRequest || {};

            const contextFactory = new ContextFactory();
            const context = contextFactory.create({
                domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.CONFIRM,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bapId: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bapUrl: requestContext.bap_uri ? requestContext.bap_id : process.env.BAP_URL,
            });

            if (!(order?.items?.length)) {
                return {
                    context,
                    error: { message: "Empty order received" }
                };
            }
            else if (this.areMultipleBppItemsSelected(order?.items)) {
                return {
                    context,
                    error: { message: "More than one BPP's item(s) selected/initialized" }
                };
            }
            else if (this.areMultipleProviderItemsSelected(order?.items)) {
                return {
                    context,
                    error: { message: "More than one Provider's item(s) selected/initialized" }
                };
            } else if (await this.arePaymentsPending(
                order?.payment,
                orderRequest?.context?.transaction_id,
                order?.payment?.paid_amount
            )) {
                return {
                    context,
                    error: {
                        message: "BAP hasn't received payment yet",
                        status: "BAP_015",
                        name: "PAYMENT_PENDING"
                    }
                };
            }

            // let paymentStatus = await juspayService.getOrderStatus(orderRequest?.context?.transaction_id);

            
            return await bppConfirmService.confirmV1(
                requestContext.bpp_uri,
                context,
                order
            );
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * confirm order
    * @param {Object} orderRequest
    */
     async ONDCConfirmOrder(orderRequest) {
        try {
            const { context: requestContext = {}, message = {} } = orderRequest;
            const { items = [], fulfillments = [], payment = {} } = message.order;

            if (!(items?.length)) {
                // console.log("11111", items?.length);
                return {
                    context,
                    error: { message: "Empty order received" }
                };
            }
            else if (this.areMultipleBppItemsSelected(items)) {
                // console.log("22222", this.areMultipleBppItemsSelected(items));
                // console.log("items", items);
                return {
                    context,
                    error: { message: "More than one BPP's item(s) selected/initialized" }
                };
            }
            else if (this.areMultipleProviderItemsSelected(items)) {
                // console.log("3333", this.areMultipleProviderItemsSelected(items));
                // console.log("items", items);
 
                return {
                    context,
                    error: { message: "More than one Provider's item(s) selected/initialized" }
                };
            } else if (await this.arePaymentsPending(
                payment,
                orderRequest?.context?.transaction_id,
                payment?.paid_amount
            )) {
                // console.log("3333");
                // console.log("payment", payment);

                // console.log("orderRequest?.context?.transaction_id", orderRequest?.context?.transaction_id);
                
                // console.log("payment?.paid_amount", payment?.paid_amount);
                
                
                return {
                    context,
                    error: {
                        message: "BAP hasn't received payment yet",
                        status: "BAP_015",
                        name: "PAYMENT_PENDING"
                    }
                };
            }

            // let paymentStatus = await juspayService.getOrderStatus(orderRequest?.context?.transaction_id);

            // var validation_flag = new BAPValidator().validateConfirm(orderRequest)

            // if(!validation_flag){
            //     return res.status(401)
                
            //     .json({ message : { 
            //             "ack": { "status": "NACK" },  
            //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
            //         })
            // }

            return await bppConfirmService.ONDCConfirm(
                requestContext.bpp_uri,
                orderRequest
            );
        }
        catch (err) {
            throw err;
        }
    }

    async ONDCConfirmOrderEvent(orderRequest) {
        try {
            const { context: context = {}, message = {} } = orderRequest;
            const { items = [], fulfillments = [], payment = {} } = message.order;

            // console.log("Harnath aaaaaa");
            // console.log("orderRequest", orderRequest);
            // console.log("items", items);
            
            if (!(items?.length)) {
                // console.log("Harnath bbbbbbb");

                return {
                    context,
                    error: { message: "Empty order received" }
                };
            }
            else if (this.areMultipleBppItemsSelected(items)) {
                // console.log("Harnath ccccccc");

                return {
                    context,
                    error: { message: "More than one BPP's item(s) selected/initialized" }
                };
            }
            // else if (this.areMultipleProviderItemsSelected(items)) {
            //     return {
            //         context,
            //         error: { message: "More than one Provider's item(s) selected/initialized" }
            //     };
            else if (await this.arePaymentsPending(
                payment,
                orderRequest?.context?.transaction_id,
                payment?.paid_amount
            )) {
                // console.log("Harnath ddddddd");

                return {
                    context,
                    error: {
                        message: "BAP hasn't received payment yet",
                        status: "BAP_015",
                        name: "PAYMENT_PENDING"
                    }
                };
            }

            // let paymentStatus = await juspayService.getOrderStatus(orderRequest?.context?.transaction_id);

            // var validation_flag = new BAPValidator().validateConfirm(orderRequest)

            // if(!validation_flag){
            //     return res.status(401)
                
            //     .json({ message : { 
            //             "ack": { "status": "NACK" },  
            //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
            //         })
            // }
            // console.log("Harnath eeeeeee");

            return await bppConfirmService.ONDCConfirm(
                context.bpp_uri,
                orderRequest
            );
        }
        catch (err) {
            // console.log("Harnath 111 error", err);
            
            throw err;
        }
    }
}

export default ConfirmOrderService;
