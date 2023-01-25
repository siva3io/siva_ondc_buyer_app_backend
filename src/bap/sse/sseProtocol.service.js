import { PROTOCOL_CONTEXT } from '../../shared/utils/constants.js';
import { CallWebhook } from '../../shared/utils/protocolApis/index.js';
import { sendSSEResponse } from '../../shared/utils/sse.js';
import axios from 'axios';
import { produceKafkaEvent, kafkaClusters } from '../../shared/eda/kafka.js'
import { ProviderValidationSchema } from './sseValidationSchema.js';
import { topics } from '../../shared/eda/consumerInit/initConsumer.js';
import Validator from 'jsonschema';
var validator = new Validator.Validator();
import { v4 as uuidv4 } from 'uuid';
import {cancellation_reason} from '../../shared/db/cancellation_reason.js'
import { UpsertBapUserCartItem,DeleteBapUserCartItem, addOrUpdateOrderWithTransactionId, getCartByTransactionId, UpsertOnBapIssue, UpsertOnBppIssue, getOrderById, getOrderByTransactionId } from '../../shared/db/dbService.js';


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

class SseProtocol {

    /**
    * on cancel
    * @param {Object} response 
    */
    async onCancel(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            
            let orderDetails = getOrderByTransactionId(response?.context?.transaction_id)
            if (orderDetails?.state != 'Cancelled' && response?.message?.order?.state == "Cancelled"){
                orderDetails.state = 'Cancelled'
                orderDetails.cancelled_by ='Buyer'
                orderDetails.cancelled_at = new Date()  
                cancellation_reason.every(cancel_reason => {
                    if(response?.message?.order?.tags?.cancellation_reason_id == cancel_reason?.code){
                        orderDetails.cancellation_reason = response?.message?.order?.tags?.cancellation_reason_id||cancel_reason?.code;
                        orderDetails.cancellation_remark = cancel_reason?.reason;
                        return false;
                    }
                    return true;
                });
            }
            await addOrUpdateOrderWithTransactionId(response?.context?.transaction_id, {
                ...orderDetails
            });
            //TODO store/update in db

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_CANCEL,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * on confirm
     * @param {Object} response 
     */
    async onConfirm(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_CONFIRM,
                response,
            );


            if (response.context.bpp_id == process.env.BPP_ID) {
                sendSSEResponse(
                    "bppEunimartOrderConfirmSivaOndc",
                    PROTOCOL_CONTEXT.ON_CONFIRM,
                    response,
                    true
                );

            }

            let order = { state: response?.message?.order?.state, id: response?.message?.order?.id, onConfirm: response }
            let filterQuery = {
                transactionId : response?.context?.transaction_id
            }
            await DeleteBapUserCartItem(filterQuery)
            await addOrUpdateOrderWithTransactionId(response?.context?.transaction_id, order)
            //TODO store in db

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on init
    * @param {Object} response 
    */
    async onInit(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            
            let cart = await getCartByTransactionId(response?.context?.transaction_id)
            if (cart) {
                Object.assign(cart['order'], {
                    fulfillments:response?.message?.order?.fulfillments,
                    billing:response?.message?.order?.billing,
                    payment:response?.message?.order?.payment,
            });

            let filterQuery = {
                transactionId: response?.context?.transaction_id,
            }               
            await UpsertBapUserCartItem(filterQuery, cart)
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_INIT,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on search
    * @param {Object} response 
    */
    async onSearch(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("search", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            let providers
            try {
                providers = response?.message?.catalog["bpp/providers"]

            } catch (error) {
                return {
                    message: {
                        ack: {
                            status: "NACK"
                        }
                    }
                };
            }
            // let flag = false
            // var validatorResponse = await validator.validate(providers, ProviderValidationSchema);
            // if (validatorResponse["errors"].length == 0) {
            //     flag = true
            // }
            let flag = true

            // if (!flag) {
            //     console.error('VALIDATION_ERROR===========>', response?.message?.catalog['bpp/descriptor']?.name, validatorResponse)
            //     return {
            //         message: {
            //             ack: {
            //                 status: "NACK"
            //             }
            //         }
            //     };
            // }

            if (flag == true) {
                sendSSEResponse(
                    messageId,
                    PROTOCOL_CONTEXT.ON_SEARCH,
                    response,
                );
            }

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }


    /**
    * on quote
    * @param {Object} response 
    */
    async onQuote(response) {
        try {
            const { messageId } = response;

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_SELECT,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on status
    * @param {Object} response 
    */
    async onStatus(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            
            await addOrUpdateOrderWithTransactionId(response?.context?.transaction_id, {state:response?.message?.order?.state})

            //TODO store/update in db

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_STATUS,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on support
    * @param {Object} response 
    */
    async onSupport(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_SUPPORT,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on support
    * @param {Object} response 
    */
    async onRating(response) {
        try {
            const messageId = response?.context?.message_id;
            // CallWebhook("on_rating", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            // console.log("onresponse",response)
            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_RATING,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on bap issue
    * @param {Object} response 
    */
    async onBapIssue(response) {
        try {
            await UpsertOnBapIssue(response)
            let issue_data = response?.message?.issue_resolution_details?.issue
            delete issue_data.order
            await UpsertOnBppIssue(response)
            const messageId = response?.context?.message_id;
            // CallWebhook("on_issue", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_ISSUE,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on bpp issue
    * @param {Object} response 
    */
    async onBppIssue(response) {
        try {
            await UpsertOnBapIssue(response)
            await UpsertOnBppIssue(response)
            const messageId = response?.context?.message_id;
            // CallWebhook("on_issue", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }
            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_ISSUE,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on support
    * @param {Object} response 
    */
    async onIssueStatus(response) {
        try {
            const messageId = response?.context?.message_id;
            // CallWebhook("on_status", response)
            if (response.context?.bpp_id != undefined) {
                // console.log(JSON.stringify(response));
            }
            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_STATUS,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }


    /**
    * on track
    * @param {Object} response 
    */
    async onTrack(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_TRACK,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on update
    * @param {Object} response
    */
    async onUpdate(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }


            let orderDetails = await getOrderById(response?.message?.order?.id);
            if (!orderDetails) {
                orderDetails = await getOrderByTransactionId(response?.context?.transaction_id);
            }

            let new_order_items = [];
                for(let i=0;i<orderDetails?.items.length;i++){
                if(!orderDetails?.items[i]?.tags && orderDetails?.items[i]?.tags?.status!="Cancelled" && orderDetails?.items[i]?.tags?.status!="Return_Approved"){
                (response?.message?.order?.items).forEach(async request_item => {
                    if (request_item?.id == orderDetails?.items[i]?.id) {
                        if (request_item?.tags?.status == 'Cancelled' || request_item?.tags?.status == 'Return_Approved') {
                            const new_order_item = JSON.parse(JSON.stringify( orderDetails?.items[i]));
                            orderDetails.items[i]["quantity"]["count"] = parseInt(orderDetails?.items[i]?.quantity?.count) - parseInt(request_item?.quantity?.count);
                            if (orderDetails?.items[i]["quantity"]["count"] == 0) {
                                orderDetails.items[i]["quantity"]["count"] = request_item?.quantity?.count
                                orderDetails.items[i]["tags"] = request_item?.tags ;
                            } else {
                                new_order_item["quantity"]["count"] = request_item?.quantity?.count;
                                new_order_item["tags"] = request_item?.tags ;
                                new_order_items.push(new_order_item)
                            }
                        }
                    }
                })
            }
            };
            orderDetails.items = (orderDetails?.items).concat(new_order_items)

            // await addOrUpdateOrderWithTransactionId(requestContext?.transaction_id, orderDetails)

            // let orderDetails = await getOrderById(response?.message?.order?.id);
            // if (!orderDetails) {
            //     orderDetails = await getOrderByTransactionId(response?.context?.transaction_id);
            // }
            // if (response?.message?.order?.items) {
            //     (orderDetails?.items).forEach(order_item => {
            //         (response?.message?.order?.items).forEach(request_item => {
            //             if (request_item?.id == order_item?.id) {
            //                 if (order_item?.tags?.update_type == "cancel" || order_item?.tags?.update_type == "return")
            //                     order_item["tags"] = request_item?.tags || {}
            //             }
            //         })
            //     })
            // }
            
            if (orderDetails?.state != 'Delivered' && response?.message?.order?.state == "Delivered"){
                orderDetails.delivered_at = new Date()  
            }
            else if (orderDetails?.state != 'Cancelled' && response?.message?.order?.state == "Cancelled"){
                orderDetails.cancelled_at = new Date()  
                orderDetails.cancelled_by = "Seller"
                cancellation_reason.every(cancel_reason => {
                    if(response?.message?.order?.tags?.cancellation_reason_id == cancel_reason?.code){
                        orderDetails.cancellation_reason = response?.message?.order?.tags?.cancellation_reason_id||cancel_reason?.code;
                        orderDetails.cancellation_remark = cancel_reason?.reason;
                        return false;
                    }
                    return true;
                });
            } else if (orderDetails?.state != 'Shipped' && response?.message?.order?.state == "Shipped"){
                orderDetails.shipped_at = new Date()  
            }
            orderDetails.quote = response?.message?.order?.quote
            orderDetails.state = response?.message?.order?.state
            //TODO store/update in db

            addOrUpdateOrderWithTransactionId(response?.context?.transaction_id, orderDetails)

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_UPDATE,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on search
    * @param {Object} response 
    */
    async onSelect(response) {
        try {
            const messageId = response?.context?.message_id;
            CallWebhook("order_process", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            let cart = await getCartByTransactionId(response?.context?.transaction_id)
            let quote = JSON.stringify(response?.message?.order?.quote || {})
            cart.order['quote'] = JSON.parse(quote)
            cart['onselect'] = response

            let filterQuery = {
                transactionId : response?.context?.transaction_id,
            }
            await UpsertBapUserCartItem(filterQuery, cart)
            
            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.ON_SELECT,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on rating categories
    * @param {Object} response 
    */
    async ratingCategories(response) {
        try {
            const messageId = response?.context?.message_id;
            // CallWebhook("rating_categories", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.RATING_CATEGORIES,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on rating categories
    * @param {Object} response 
    */
    async feedbackCategories(response) {
        try {
            const messageId = response?.context?.message_id;
            // CallWebhook("feedback_categories", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.FEEDBACK_CATEGORIES,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on rating categories
    * @param {Object} response 
    */
    async feedbackForm(response) {
        try {
            const messageId = response?.context?.message_id;
            // CallWebhook("feedback_form", response)
            if (response.context?.bpp_id != undefined && response.context.bpp_id == process.env.BPP_ID) {
                // console.log(JSON.stringify(response));
            }

            sendSSEResponse(
                messageId,
                PROTOCOL_CONTEXT.FEEDBACK_FORM,
                response,
            );

            return {
                message: {
                    ack: {
                        status: "ACK"
                    }
                }
            };
        }
        catch (err) {
            throw err;
        }
    }


};

export default SseProtocol;