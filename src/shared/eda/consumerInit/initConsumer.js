//@ts-check
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

import {createOrUpdateProductConsumer} from "../../../bap/bap_client/products/products.consumer.js"
import {createOrUpdateProviderConsumer} from "../../../bap/bap_client/provider/provider.consumer.js"
import {bapSearchConsumer, bapSearchAckConsumer, bapBppSearchConsumer, bapBppSearchAckConsumer} from "../../../bap/discovery/search.consumer.js"
import {bapSelectConsumer, bapSelectAckConsumer, bapBppSelectConsumer, bapBppSelectAckConsumer} from "../../../bap/order/select/selectOrder.consumer.js"
import {bapInitConsumer, bapInitAckConsumer, bapBppInitConsumer, bapBppInitAckConsumer} from "../../../bap/order/init/initOrder.consumer.js"
import {bapConfirmConsumer, bapConfirmAckConsumer, bapBppConfirmConsumer, bapBppConfirmAckConsumer} from "../../../bap/order/confirm/confirmOrder.consumer.js"
import {bapStatusConsumer, bapStatusAckConsumer, bapBppStatusConsumer, bapBppStatusAckConsumer} from "../../../bap/order/status/orderStatus.consumer.js"
import {bapCancelConsumer, bapCancelAckConsumer, bapBppCancelConsumer, bapBppCancelAckConsumer} from "../../../bap/order/cancel/cancelOrder.consumer.js"
import {bapTrackConsumer, bapTrackAckConsumer, bapBppTrackConsumer, bapBppTrackAckConsumer} from "../../../bap/fulfillment/track.consumer.js"
import {bapSupportConsumer, bapSupportAckConsumer, bapBppSupportConsumer, bapBppSupportAckConsumer} from "../../../bap/support/support.consumer.js"
import {bapRatingConsumer, bapRatingAckConsumer, bapBppRatingConsumer, bapBppRatingAckConsumer, bapRatingCategoriesConsumer, bapRatingCategoriesAckConsumer, bapBppRatingCategoriesAckConsumer, bapBppRatingCategoriesConsumer, bapFeedbackCategoriesConsumer, bapFeedbackCategoriesAckConsumer, bapFeedbackFormConsumer, bapFeedbackFormAckConsumer, bapBppFeedbackCategoriesConsumer, bapBppFeedbackCategoriesAckConsumer, bapBppFeedbackFormConsumer, bapBppFeedbackFormAckConsumer} from "../../../bap/rating/rating.consumer.js"
// import {bapIssueConsumer, bapIssueAckConsumer, bapBppIssueConsumer, bapBppIssueAckConsumer} from "../../../igm/bap/issue.consumer.js"
// import {bppIssueConsumer, bppIssueAckConsumer, bppBapIssueConsumer, bppBapIssueAckConsumer} from "../../../igm/bpp/issue.consumer.js"
// import {bppCancelOrderConsumer} from "../../../bpp/order/cancel/bppCancelOrder.consumer.js"


// import {lspBapSearchConsumer, lspBapSearchAckConsumer, lspBapBppSearchConsumer, lspBapBppSearchAckConsumer} from "../../../lsp/bap/discovery/search.consumer.js"
// import {lspBapInitConsumer, lspBapInitAckConsumer, lspBapBppInitConsumer, lspBapBppInitAckConsumer} from "../../../lsp/bap/order/init/initOrder.consumer.js"
// import {lspBapConfirmConsumer, lspBapConfirmAckConsumer, lspBapBppConfirmConsumer, lspBapBppConfirmAckConsumer} from "../../../lsp/bap/order/confirm/confirmOrder.consumer.js"
// import {lspBapStatusConsumer, lspBapStatusAckConsumer, lspBapBppStatusConsumer, lspBapBppStatusAckConsumer} from "../../../lsp/bap/order/status/orderStatus.consumer.js"
// import {lspBapCancelConsumer, lspBapCancelAckConsumer, lspBapBppCancelConsumer, lspBapBppCancelAckConsumer} from "../../../lsp/bap/order/cancel/cancelOrder.consumer.js"
// import {lspBapTrackConsumer, lspBapTrackAckConsumer, lspBapBppTrackConsumer, lspBapBppTrackAckConsumer} from "../../../lsp/bap/fulfillment/track.consumer.js"
// import {lspBapUpdateConsumer, lspBapUpdateAckConsumer, lspBapBppUpdateConsumer, lspBapBppUpdateAckConsumer} from "../../../lsp/bap/order/update/updateOrder.consumer.js"
// import {lspBapSupportConsumer, lspBapSupportAckConsumer, lspBapBppSupportConsumer, lspBapBppSupportAckConsumer} from "../../../lsp/bap/support/support.consumer.js"

// import { createIssueConsumer,createOnIssueConsumer,createIssueAckConsumer } from "../../../igm/consumers/issue.consumer.js"
// import {issueStatusConsumer, bapBppIssueStatusConsumer,bapBppIssueStatusAckConsumer, issueStatusAckConsumer } from "../../../igm/shared/issue.consumer.js"

// import { bppUpdateOrderConsumer } from '../../../bpp/order/update/updateOrder.consumer.js'

import { consumeKafkaEvent, kafkaClusters } from '../kafka.js'
// import { bppOrderStatusConsumer } from "../../../bpp/order/status/bppOrderStatus.consumer.js"
import { redisClient } from "../../database/redis.js"

const topics  = {

    WEB3_LIVE_FEED: 'web3.live_feed',

    CREATE_ISSUE: 'public.issues.create',
    CREATE_ON_ISSUE: 'public.issues.on_create',
    CREATE_ISSUE_ACK: 'public.ondc_ack',
    // SEARCH_PRODUCT_PRODUCER :'public.ondc-beckn.products.search',

    // SALES_ORDER_CREATE: 'public.orders.sales_order.create',
    SALES_ORDER_CREATE: 'public.ondc.orders.create',

    BPP_SALES_ORDER_STATUS: 'public.orders.sales_order.status',
    BPP_SALES_ORDER_STATUS_RESPONSE: 'public.ondc.orders.status',
    SALES_ORDER_CANCEL: 'public.orders.sales_order.cancel',
    SALES_ORDER_STATUS_UPDATE: 'public.ondc.orders.update_status',
    BPP_SALES_ORDER_CANCEL_RESPONSE: 'public.ondc.orders.cancel',
    BPP_ORDER_STATUS_UPDATE : 'public.orders.sales_order.ondc_update_status',

    PRODUCT_CREATE_UPDATE:'public.ondc-beckn.products.sync',
    PRODUCT_CREATE_UPDATE_ACK : 'public.ondc-beckn.products.sync_ack',
    PROVIDER_CREATE_UPDATE:'public.ondc-beckn.core.company.sync',
    PROVIDER_CREATE_UPDATE_ACK : 'public.ondc-beckn.core.company.sync_ack',
    
    CLIENT_API_BAP_SEARCH: "client_api_bap_search",
    CLIENT_API_BAP_SEARCH_ACK: "ondc_ack",
    CLIENT_API_BAP_SELECT: "client_api_bap_select",
    CLIENT_API_BAP_SELECT_ACK: "ondc_ack",
    CLIENT_API_BAP_INIT: "client_api_bap_init",
    CLIENT_API_BAP_INIT_ACK: "ondc_ack",
    CLIENT_API_BAP_CONFIRM: "client_api_bap_confirm",
    CLIENT_API_BAP_CONFIRM_ACK: "ondc_ack",
    CLIENT_API_BAP_STATUS: "client_api_bap_status",
    CLIENT_API_BAP_STATUS_ACK: "ondc_ack",
    CLIENT_API_BAP_CANCEL: "client_api_bap_cancel",
    CLIENT_API_BAP_CANCEL_ACK: "ondc_ack",
    CLIENT_API_BAP_RETURN: "client_api_bap_return",
    CLIENT_API_BAP_RETURN_ACK: "ondc_ack",
    
    CLIENT_API_BAP_TRACK: "client_api_bap_track",
    CLIENT_API_BAP_TRACK_ACK: "ondc_ack",
    CLIENT_API_BAP_SUPPORT: "client_api_bap_support",
    CLIENT_API_BAP_SUPPORT_ACK: "ondc_ack",
    CLIENT_API_BAP_RATING: "client_api_bap_rating",
    CLIENT_API_BAP_RATING_ACK: "ondc_ack",
    CLIENT_API_BAP_RATING_CATEGORIES:"client_api_bap_rating_categories",
    CLIENT_API_BAP_RATING_CATEGORIES_ACK:"ondc_ack",
    CLIENT_API_BAP_FEEDBACK_CATEGORIES:"client_api_bap_feedback_categories",
    CLIENT_API_BAP_FEEDBACK_CATEGORIES_ACK:"ondc_ack",
    CLIENT_API_BAP_FEEDBACK_FORM:"client_api_bap_feedback_form",
    CLIENT_API_BAP_FEEDBACK_FORM_ACK:"ondc_ack",
    CLIENT_API_BAP_ISSUE: "client_api_bap_issue",
    CLIENT_API_BAP_ISSUE_ACK: "ondc_ack",

    CLIENT_API_LSP_BAP_SEARCH: "client_api_lsp_bap_search",
    CLIENT_API_LSP_BAP_SEARCH_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_INIT: "client_api_lsp_bap_init",
    CLIENT_API_LSP_BAP_INIT_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_CONFIRM: "client_api_lsp_bap_confirm",
    CLIENT_API_LSP_BAP_CONFIRM_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_STATUS: "client_api_lsp_bap_status",
    CLIENT_API_LSP_BAP_STATUS_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_TRACK: "client_api_lsp_bap_track",
    CLIENT_API_LSP_BAP_TRACK_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_CANCEL: "client_api_lsp_bap_cancel",
    CLIENT_API_LSP_BAP_CANCEL_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_UPDATE: "client_api_lsp_bap_update",
    CLIENT_API_LSP_BAP_UPDATE_ACK: "ondc_ack",
    CLIENT_API_LSP_BAP_SUPPORT: "client_api_lsp_bap_support",
    CLIENT_API_LSP_BAP_SUPPORT_ACK: "ondc_ack",



    BAP_BPP_SEARCH: "bap_bpp_search",
    BAP_BPP_SEARCH_ACK: "ondc_ack",
    BAP_BPP_SELECT: "bap_bpp_select",
    BAP_BPP_SELECT_ACK: "ondc_ack",
    BAP_BPP_INIT: "bap_bpp_init",
    BAP_BPP_INIT_ACK: "ondc_ack",
    BAP_BPP_CONFIRM: "bap_bpp_confirm",
    BAP_BPP_CONFIRM_ACK: "ondc_ack",
    BAP_BPP_STATUS: "bap_bpp_status",
    BAP_BPP_STATUS_ACK: "ondc_ack",
    BAP_BPP_CANCEL: "bap_bpp_cancel",
    BAP_BPP_CANCEL_ACK: "ondc_ack",
    BAP_BPP_RETURN: "bap_bpp_return",
    BAP_BPP_RETURN_ACK: "ondc_ack",
    
    BAP_BPP_TRACK: "bap_bpp_track",
    BAP_BPP_TRACK_ACK: "ondc_ack",
    BAP_BPP_SUPPORT: "bap_bpp_support",
    BAP_BPP_SUPPORT_ACK: "ondc_ack",
    BAP_BPP_RATING: "bap_bpp_rating",
    BAP_BPP_RATING_ACK: "ondc_ack",
    BAP_BPP_RATING_CATEGORIES: "bap_bpp_rating_categories",
    BAP_BPP_RATING_CATEGORIES_ACK: "ondc_ack",
    BAP_BPP_FEEDBACK_CATEGORIES:"bap_bpp_feedback_categories",
    BAP_BPP_FEEDBACK_CATEGORIES_ACK:"ondc_ack",
    BAP_BPP_FEEDBACK_FORM:"bap_bpp_feedback_form",
    BAP_BPP_FEEDBACK_FORM_ACK:"ondc_ack",
    BAP_BPP_ISSUE: "bap_bpp_issue",
    BAP_BPP_ISSUE_ACK: "ondc_ack",
    
    
    CLIENT_API_IGM_ISSUE_STATUS: "client_api_igm_issue_status",
    CLIENT_API_IGM_ISSUE_STATUS_ACK: "ondc_ack",

    BAP_BPP_ISSUE_STATUS_CONSUMER: "bap_bpp_issue_status_consumer",
    BAP_BPP_ISSUE_STATUS_CONSUMER_ACK: "ondc_ack",

    BPP_BAP_ISSUE: "bpp_bap_issue",
    BPP_BAP_ISSUE_ACK:"ondc_ack",
    
    CLIENT_API_BPP_ISSUE:"client_api_bpp_issue",    
    CLIENT_API_BPP_ISSUE_ACK:"ondc_ack",
 


    LSP_BAP_BPP_SEARCH: "lsp_bap_bpp_search",
    LSP_BAP_BPP_SEARCH_ACK: "ondc_ack",
    LSP_BAP_BPP_INIT: "lsp_bap_bpp_init",
    LSP_BAP_BPP_INIT_ACK: "ondc_ack",
    LSP_BAP_BPP_CONFIRM: "lsp_bap_bpp_confirm",
    LSP_BAP_BPP_CONFIRM_ACK: "ondc_ack",
    LSP_BAP_BPP_STATUS: "lsp_bap_bpp_status",
    LSP_BAP_BPP_STATUS_ACK: "ondc_ack",
    LSP_BAP_BPP_TRACK: "lsp_bap_bpp_track",
    LSP_BAP_BPP_TRACK_ACK: "ondc_ack",
    LSP_BAP_BPP_CANCEL: "lsp_bap_bpp_cancel",
    LSP_BAP_BPP_CANCEL_ACK: "ondc_ack",
    LSP_BAP_BPP_UPDATE: "lsp_bap_bpp_update",
    LSP_BAP_BPP_UPDATE_ACK: "ondc_ack",
    LSP_BAP_BPP_SUPPORT: "lsp_bap_bpp_support",
    LSP_BAP_BPP_SUPPORT_ACK: "ondc_ack",

    ONDC_ACK:"ondc_ack"
}


const techAckConsumer = async (consumerConfig) => {
    
    let consumer = await consumeKafkaEvent(consumerConfig)

    // let ackResponse

    await consumer.run({
        autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {

            let response = JSON.parse(message.value.toString());

            // console.log({
            //     partition,
            //     topic: topic,
            //     offset: message.offset,
            //     value: message.value.toString(),
            // })

            if (response.context?.message_id) {
                await redisClient.set(response.context?.message_id, JSON.stringify(response));
            }
        }
    }
    )
}

//currently bpp cluster is not in use 
// const bppAckConsumer = async (consumerConfig) => {
    
//     let consumer = await consumeKafkaEvent(consumerConfig)

//     // let ackResponse

//     await consumer.run({
//         autoCommitInterval: 5000,
//         eachMessage: async ({ topic, partition, message }) => {

//             let response = JSON.parse(message.value.toString());

//             // console.log({
//             //     partition,
//             //     topic: topic,
//             //     offset: message.offset,
//             //     value: message.value.toString(),
//             // })

//             if (response.context?.message_id) {
//                 await redisClient.set(response.context?.message_id, JSON.stringify(response));
//             }
//         }
//     }
//     )
// }
const bapAckConsumer = async (consumerConfig) => {
    
    let consumer = await consumeKafkaEvent(consumerConfig)

    // let ackResponse

    await consumer.run({
        autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {

            let response = JSON.parse(message.value.toString());

            // console.log({
            //     partition,
            //     topic: topic,
            //     offset: message.offset,
            //     value: message.value.toString(),
            // })

            if (response.context?.message_id) {
                await redisClient.set(response.context?.message_id, JSON.stringify(response));
            }
        }
    }
    )
}
const lspAckConsumer = async (consumerConfig) => {
    
    let consumer = await consumeKafkaEvent(consumerConfig)

    // let ackResponse

    await consumer.run({
        autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {

            let response = JSON.parse(message.value.toString());

            // console.log({
            //     partition,
            //     topic: topic,
            //     offset: message.offset,
            //     value: message.value.toString(),
            // })

            if (response.context?.message_id) {
                await redisClient.set(response.context?.message_id, JSON.stringify(response));
            }
        }
    }
    )
}
const igmAckConsumer = async (consumerConfig) => {
    
    let consumer = await consumeKafkaEvent(consumerConfig)

    // let ackResponse

    await consumer.run({
        autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {

            let response = JSON.parse(message.value.toString());

            // console.log({
            //     partition,
            //     topic: topic,
            //     offset: message.offset,
            //     value: message.value.toString(),
            // })

            if (response.context?.message_id) {
                await redisClient.set(response.context?.message_id, JSON.stringify(response));
            }
        }
    }
    )
}
const bgAckConsumer = async (consumerConfig) => {
    
    let consumer = await consumeKafkaEvent(consumerConfig)

    // let ackResponse

    await consumer.run({
        autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {

            let response = JSON.parse(message.value.toString());

            // console.log({
            //     partition,
            //     topic: topic,
            //     offset: message.offset,
            //     value: message.value.toString(),
            // })

            if (response.context?.message_id) {
                await redisClient.set(response.context?.message_id, JSON.stringify(response));
            }
        }
    }
    )
}




const InitConsumer = async () => {
    
    //common consumer clusters
    techAckConsumer({cluster:kafkaClusters.Tech, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})
    // bppAckConsumer({cluster:kafkaClusters.Tech, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})
    bapAckConsumer({cluster:kafkaClusters.BAP, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})
    // lspAckConsumer({cluster:kafkaClusters.LSP, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})
    // igmAckConsumer({cluster:kafkaClusters.IGM, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})
    bgAckConsumer({cluster:kafkaClusters.BG, topic: topics.ONDC_ACK, groupId: topics.ONDC_ACK})



    createOrUpdateProductConsumer({cluster:kafkaClusters.Tech, topic: topics.PRODUCT_CREATE_UPDATE, groupId: topics.PRODUCT_CREATE_UPDATE})
    createOrUpdateProviderConsumer({cluster:kafkaClusters.Tech, topic: topics.PROVIDER_CREATE_UPDATE, groupId: topics.PROVIDER_CREATE_UPDATE})
    
    // bpp_consumers
    // bppUpdateOrderConsumer({cluster:kafkaClusters.Tech, topic: topics.BPP_ORDER_STATUS_UPDATE, groupId: topics.BPP_ORDER_STATUS_UPDATE})
    // bppOrderStatusConsumer({cluster:kafkaClusters.Tech, topic: topics.BPP_SALES_ORDER_STATUS_RESPONSE, groupId: topics.BPP_SALES_ORDER_STATUS_RESPONSE})
    // bppCancelOrderConsumer({cluster:kafkaClusters.Tech, topic: topics.BPP_SALES_ORDER_CANCEL_RESPONSE, groupId: topics.BPP_SALES_ORDER_CANCEL_RESPONSE})

    bapSearchConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SEARCH, groupId: topics.CLIENT_API_BAP_SEARCH})
    // bapSearchAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SEARCH_ACK, groupId: topics.CLIENT_API_BAP_SEARCH_ACK})
    bapSelectConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SELECT, groupId: topics.CLIENT_API_BAP_SELECT})
    // bapSelectAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SELECT_ACK, groupId: topics.CLIENT_API_BAP_SELECT_ACK})
    bapInitConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_INIT, groupId: topics.CLIENT_API_BAP_INIT})
    // bapInitAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_INIT_ACK, groupId: topics.CLIENT_API_BAP_INIT_ACK})
    bapConfirmConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_CONFIRM, groupId: topics.CLIENT_API_BAP_CONFIRM})
    // bapConfirmAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_CONFIRM_ACK, groupId: topics.CLIENT_API_BAP_CONFIRM_ACK})
    bapStatusConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_STATUS, groupId: topics.CLIENT_API_BAP_STATUS})
    // bapStatusAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_STATUS_ACK, groupId: topics.CLIENT_API_BAP_STATUS_ACK})
    bapCancelConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_CANCEL, groupId: topics.CLIENT_API_BAP_CANCEL})
    // bapCancelAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_CANCEL_ACK, groupId: topics.CLIENT_API_BAP_CANCEL_ACK})
    bapTrackConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_TRACK, groupId: topics.CLIENT_API_BAP_TRACK})
    // bapTrackAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_TRACK_ACK, groupId: topics.CLIENT_API_BAP_TRACK_ACK})
    bapSupportConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SUPPORT, groupId: topics.CLIENT_API_BAP_SUPPORT})
    // bapSupportAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_SUPPORT_ACK, groupId: topics.CLIENT_API_BAP_SUPPORT_ACK})
    bapRatingConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_RATING, groupId: topics.CLIENT_API_BAP_RATING})
    // bapRatingAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_RATING_ACK, groupId: topics.CLIENT_API_BAP_RATING_ACK})
    bapRatingCategoriesConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_RATING_CATEGORIES, groupId: topics.CLIENT_API_BAP_RATING_CATEGORIES})
    // bapRatingCategoriesAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_RATING_CATEGORIES_ACK, groupId: topics.CLIENT_API_BAP_RATING_CATEGORIES_ACK})
    bapFeedbackCategoriesConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_FEEDBACK_CATEGORIES, groupId: topics.CLIENT_API_BAP_FEEDBACK_CATEGORIES})
    // bapFeedbackCategoriesAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_FEEDBACK_CATEGORIES_ACK, groupId: topics.CLIENT_API_BAP_FEEDBACK_CATEGORIES_ACK})
    bapFeedbackFormConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_FEEDBACK_FORM, groupId: topics.CLIENT_API_BAP_FEEDBACK_FORM})
    // bapFeedbackFormAckConsumer({cluster:kafkaClusters.BAP, topic: topics.CLIENT_API_BAP_FEEDBACK_FORM_ACK, groupId: topics.CLIENT_API_BAP_FEEDBACK_FORM_ACK})
    
    // lspBapSearchConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_SEARCH, groupId: topics.CLIENT_API_LSP_BAP_SEARCH})
    // // lspBapSearchAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_SEARCH_ACK, groupId: topics.CLIENT_API_LSP_BAP_SEARCH_ACK})
    // lspBapInitConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_INIT, groupId: topics.CLIENT_API_LSP_BAP_INIT})
    // // lspBapInitAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_INIT_ACK, groupId: topics.CLIENT_API_LSP_BAP_INIT_ACK})
    // lspBapConfirmConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_CONFIRM, groupId: topics.CLIENT_API_LSP_BAP_CONFIRM})
    // // lspBapConfirmAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_CONFIRM_ACK, groupId: topics.CLIENT_API_LSP_BAP_CONFIRM_ACK})
    // lspBapStatusConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_STATUS, groupId: topics.CLIENT_API_LSP_BAP_STATUS})
    // // lspBapStatusAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_STATUS_ACK, groupId: topics.CLIENT_API_LSP_BAP_STATUS_ACK})
    // lspBapTrackConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_TRACK, groupId: topics.CLIENT_API_LSP_BAP_TRACK})
    // // lspBapTrackAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_TRACK_ACK, groupId: topics.CLIENT_API_LSP_BAP_TRACK_ACK})
    // lspBapCancelConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_CANCEL, groupId: topics.CLIENT_API_LSP_BAP_CANCEL})
    // // lspBapCancelAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_CANCEL_ACK, groupId: topics.CLIENT_API_LSP_BAP_CANCEL_ACK})
    // lspBapUpdateConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_UPDATE, groupId: topics.CLIENT_API_LSP_BAP_UPDATE})
    // // lspBapUpdateAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_UPDATE_ACK, groupId: topics.CLIENT_API_LSP_BAP_UPDATE_ACK})
    // lspBapSupportConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_SUPPORT, groupId: topics.CLIENT_API_LSP_BAP_SUPPORT})
    // lspBapSupportAckConsumer({cluster:kafkaClusters.LSP, topic: topics.CLIENT_API_LSP_BAP_SUPPORT_ACK, groupId: topics.CLIENT_API_LSP_BAP_SUPPORT_ACK})

    bapBppSearchConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SEARCH, groupId: topics.BAP_BPP_SEARCH})
    // bapBppSearchAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SEARCH_ACK, groupId: topics.BAP_BPP_SEARCH_ACK})
    bapBppSelectConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SELECT, groupId: topics.BAP_BPP_SELECT})
    // bapBppSelectAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SELECT_ACK, groupId: topics.BAP_BPP_SELECT_ACK})
    bapBppInitConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_INIT, groupId: topics.BAP_BPP_INIT})
    // bapBppInitAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_INIT_ACK, groupId: topics.BAP_BPP_INIT_ACK})
    bapBppConfirmConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_CONFIRM, groupId: topics.BAP_BPP_CONFIRM})
    // bapBppConfirmAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_CONFIRM_ACK, groupId: topics.BAP_BPP_CONFIRM_ACK})
    bapBppStatusConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_STATUS, groupId: topics.BAP_BPP_STATUS})
    // bapBppStatusAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_STATUS_ACK, groupId: topics.BAP_BPP_STATUS_ACK})
    bapBppCancelConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_CANCEL, groupId: topics.BAP_BPP_CANCEL})
    // bapBppCancelAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_CANCEL_ACK, groupId: topics.BAP_BPP_CANCEL_ACK})
    bapBppTrackConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_TRACK, groupId: topics.BAP_BPP_TRACK})
    // bapBppTrackAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_TRACK_ACK, groupId: topics.BAP_BPP_TRACK_ACK})
    bapBppSupportConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SUPPORT, groupId: topics.BAP_BPP_SUPPORT})
    // bapBppSupportAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_SUPPORT_ACK, groupId: topics.BAP_BPP_SUPPORT_ACK})
    bapBppRatingConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_RATING, groupId: topics.BAP_BPP_RATING})
    // bapBppRatingAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_RATING_ACK, groupId: topics.BAP_BPP_RATING_ACK})
    bapBppRatingCategoriesConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_RATING_CATEGORIES, groupId: topics.BAP_BPP_RATING_CATEGORIES})
    // bapBppRatingCategoriesAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_RATING_CATEGORIES_ACK, groupId: topics.BAP_BPP_RATING_CATEGORIES_ACK})
    bapBppFeedbackCategoriesConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_FEEDBACK_CATEGORIES, groupId: topics.BAP_BPP_FEEDBACK_CATEGORIES})
    // bapBppFeedbackCategoriesAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_FEEDBACK_CATEGORIES_ACK, groupId: topics.BAP_BPP_FEEDBACK_CATEGORIES_ACK})
    bapBppFeedbackFormConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_FEEDBACK_FORM, groupId: topics.BAP_BPP_FEEDBACK_FORM})
    // bapBppFeedbackFormAckConsumer({cluster:kafkaClusters.BG, topic: topics.BAP_BPP_FEEDBACK_FORM_ACK, groupId: topics.BAP_BPP_FEEDBACK_FORM_ACK})

    // bapBppIssueConsumer({cluster:kafkaClusters.IGM, topic: topics.BAP_BPP_ISSUE, groupId: topics.BAP_BPP_ISSUE})
    // // bapBppIssueAckConsumer({cluster:kafkaClusters.IGM, topic: topics.BAP_BPP_ISSUE_ACK, groupId: topics.BAP_BPP_ISSUE_ACK})

    // lspBapBppSearchConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_SEARCH, groupId: topics.LSP_BAP_BPP_SEARCH})
    // // lspBapBppSearchAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_SEARCH_ACK, groupId: topics.LSP_BAP_BPP_SEARCH_ACK})
    // lspBapBppInitConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_INIT, groupId: topics.LSP_BAP_BPP_INIT})
    // // lspBapBppInitAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_INIT_ACK, groupId: topics.LSP_BAP_BPP_INIT_ACK})
    // lspBapBppConfirmConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_CONFIRM, groupId: topics.LSP_BAP_BPP_CONFIRM})
    // // lspBapBppConfirmAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_CONFIRM_ACK, groupId: topics.LSP_BAP_BPP_CONFIRM_ACK})
    // lspBapBppStatusConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_STATUS, groupId: topics.LSP_BAP_BPP_STATUS})
    // // lspBapBppStatusAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_STATUS_ACK, groupId: topics.LSP_BAP_BPP_STATUS_ACK})
    // lspBapBppTrackConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_TRACK, groupId: topics.LSP_BAP_BPP_TRACK})
    // // lspBapBppTrackAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_TRACK_ACK, groupId: topics.LSP_BAP_BPP_TRACK_ACK})
    // lspBapBppCancelConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_CANCEL, groupId: topics.LSP_BAP_BPP_CANCEL})
    // // lspBapBppCancelAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_CANCEL_ACK, groupId: topics.LSP_BAP_BPP_CANCEL_ACK})
    // lspBapBppUpdateConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_UPDATE, groupId: topics.LSP_BAP_BPP_UPDATE})
    // // lspBapBppUpdateAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_UPDATE_ACK, groupId: topics.LSP_BAP_BPP_UPDATE_ACK})
    // lspBapBppSupportConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_SUPPORT, groupId: topics.LSP_BAP_BPP_SUPPORT})
    // lspBapBppSupportAckConsumer({cluster:kafkaClusters.BG, topic: topics.LSP_BAP_BPP_SUPPORT_ACK, groupId: topics.LSP_BAP_BPP_SUPPORT_ACK})
    
    //-----------------------------------IGM------------------------------------------------------------------

    // createIssueConsumer({cluster:kafkaClusters.IGM, topic: topics.CREATE_ISSUE, groupId: topics.CREATE_ISSUE})
    // createOnIssueConsumer({cluster:kafkaClusters.IGM, topic: topics.CREATE_ON_ISSUE, groupId: topics.CREATE_ON_ISSUE})
    // // createIssueAckConsumer({cluster:kafkaClusters.IGM, topic: topics.CREATE_ISSUE_ACK, groupId: topics.CREATE_ISSUE_ACK})
    
    // bapIssueConsumer({cluster:kafkaClusters.IGM, topic: topics.CLIENT_API_BAP_ISSUE, groupId: topics.CLIENT_API_BAP_ISSUE})
    // // bapIssueAckConsumer({cluster:kafkaClusters.IGM, topic: topics.CLIENT_API_BAP_ISSUE_ACK, groupId: topics.CLIENT_API_BAP_ISSUE_ACK})
    
    // bppBapIssueConsumer({cluster:kafkaClusters.IGM,topic:topics.BPP_BAP_ISSUE, groupId:topics.BPP_BAP_ISSUE})
    // // bppBapIssueAckConsumer({cluster:kafkaClusters.IGM,topic:topics.BPP_BAP_ISSUE_ACK, groupId:topics.BPP_BAP_ISSUE_ACK})
    
    // bppIssueConsumer({cluster:kafkaClusters.IGM,topic:topics.CLIENT_API_BPP_ISSUE,groupId:topics.CLIENT_API_BPP_ISSUE} )
    // // bppIssueAckConsumer({cluster:kafkaClusters.IGM,topic:topics.CLIENT_API_BPP_ISSUE_ACK,groupId:topics.CLIENT_API_BPP_ISSUE_ACK})

    // issueStatusConsumer({cluster:kafkaClusters.IGM,topic:topics.CLIENT_API_IGM_ISSUE_STATUS,groupId:topics.CLIENT_API_IGM_ISSUE_STATUS})
    // // issueStatusAckConsumer({cluster:kafkaClusters.IGM,topic:topics.CLIENT_API_IGM_ISSUE_STATUS_ACK,groupId:topics.CLIENT_API_IGM_ISSUE_STATUS_ACK})

    // bapBppIssueStatusConsumer({cluster:kafkaClusters.IGM,topic:topics.BAP_BPP_ISSUE_STATUS_CONSUMER,groupId:topics.BAP_BPP_ISSUE_STATUS_CONSUMER})
    // bapBppIssueStatusAckConsumer({cluster:kafkaClusters.IGM,topic:topics.BAP_BPP_ISSUE_STATUS_CONSUMER_ACK,groupId:topics.BAP_BPP_ISSUE_STATUS_CONSUMER_ACK})
}

export { InitConsumer, topics };
