import { onOrderRating } from "../../shared/utils/protocolApis/index.js";
import { PROTOCOL_CONTEXT, SUBSCRIBER_TYPE } from "../../shared/utils/constants.js";

import BppRatingService from "./bppRating.service.js";
import ContextFactory from "../../shared/factories/ContextFactory.js";
import BAPValidator from "../../shared/utils/validations/bap_validations/validations.js";
import { v4 as uuidv4 } from 'uuid';
import { isSignatureValid } from "../../shared/utils/cryptic.js";


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

const bppRatingService = new BppRatingService();

class RatingService {
  /**
   * rating order
   * @param {Object} orderRequest
   */
  async BapRating(orderRequest) {
    try {

      const { context: requestContext = {}, message } =
        orderRequest || {};

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.RATING,
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
      
      const bppResponse = await bppRatingService.BapRating(
        requestContext.bpp_uri,
        context,
        message
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

  /**
   * rating order
   * @param {Object} orderRequest
   * @param {Boolean} isMultiSellerRequest
   */
  async ONDCRatingOrder(orderRequest, isMultiSellerRequest = false) {
    try {
      const { context: requestContext = {}, message: refObj = {} } = orderRequest || {};

      var validation_flag = new BAPValidator().validateRating(orderRequest)

            if(!validation_flag){
                return res.status(401)
                .json({ message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
                    })
            }

      const bppResponse = await bppRatingService.ONDCRating(
        requestContext.bpp_uri,
        orderRequest
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

  async ONDCRatingOrderEvent(orderRequest, isMultiSellerRequest = false) {
    try {
      const { context: requestContext = {}, message: refObj = {} } = orderRequest || {};

      // var validation_flag = new BAPValidator().validateRating(orderRequest)

      //       if(!validation_flag){
      //           return { message : { 
      //             "ack": { "status": "NACK" },  
      //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
      //         }
      //       }

      const bppResponse = await bppRatingService.ONDCRating(
        requestContext.bpp_uri,
        orderRequest
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

  async ONDCRatingCategoriesEvent(orderRequest, isMultiSellerRequest = false) {
    try {
      const { context: requestContext = {}, message: refObj = {} } = orderRequest || {};

      // var validation_flag = new BAPValidator().validateRating(orderRequest)

      //       if(!validation_flag){
      //           return { message : { 
      //             "ack": { "status": "NACK" },  
      //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
      //         }
      //       }

      const bppResponse = await bppRatingService.ONDCRatingCategories(
        requestContext.bpp_uri,
        orderRequest
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

  async ONDCFeedbackCategoriesEvent(orderRequest, isMultiSellerRequest = false) {
    try {
      const { context: requestContext = {}, message: refObj = {} } = orderRequest || {};

      // var validation_flag = new BAPValidator().validateRating(orderRequest)

      //       if(!validation_flag){
      //           return { message : { 
      //             "ack": { "status": "NACK" },  
      //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
      //         }
      //       }

      const bppResponse = await bppRatingService.ONDCFeedbackCategories(
        requestContext.bpp_uri,
        orderRequest
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }
  
  async ONDCFeedbackFormEvent(orderRequest, isMultiSellerRequest = false) {
    try {
      const { context: requestContext = {}, message: refObj = {} } = orderRequest || {};

      // var validation_flag = new BAPValidator().validateRating(orderRequest)

      //       if(!validation_flag){
      //           return { message : { 
      //             "ack": { "status": "NACK" },  
      //             "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" } } 
      //         }
      //       }

      const bppResponse = await bppRatingService.ONDCFeedbackForm(
        requestContext.bpp_uri,
        orderRequest
      );

      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

  /**
   * rating order
   * @param {Object} ratingRequest
   */
  async rating(ratingRequest) {
    try {
      const { context: requestContext, message } = ratingRequest || {};

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        action: PROTOCOL_CONTEXT.SEARCH,
        transactionId: requestContext?.transaction_id,
        bppId: requestContext?.bpp_id,
        city: requestContext.city,
        state: requestContext.state,
      });

      return await bppRatingService.rating(context, message?.ref_id);
    } catch (err) {
      throw err;
    }
  }

  /**
   * sating multiple orders
   * @param {Array} requests
   */
  async satingMultipleOrder(requests) {
    const satingResponses = await Promise.all(
      requests.map(async (request) => {
        try {
          const satingResponse = await this.sating(request);
          return satingResponse;
        } catch (err) {
          throw err;
        }
      })
    );

    return ratingResponses;
  }

  /**
   * on rating order
   * @param {Object} messageId
   */
  async onRating(messageId) {
    try {
      const protocolRatingResponse = await onOrderRating(messageId);
      if (protocolRatingResponse && protocolRatingResponse.length)
        return protocolRatingResponse?.[0];
      else {
        const contextFactory = new ContextFactory();
        const context = contextFactory.create({
          messageId: messageId,
          action: PROTOCOL_CONTEXT.ON_SUPPORT,
        });

        return {
          context,
          error: {
            message: "No data found",
          },
        };
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * on rating multiple order
   * @param {Object} messageId
   */
  async onRatingMultipleOrder(messageIds) {
    try {
      const onRatingResponse = await Promise.all(
        messageIds.map(async (messageId) => {
          try {
            const onRatingResponse = await this.onRating(messageId);
            return { ...onRatingResponse };
          } catch (err) {
            throw err;
          }
        })
      );

      return onRatingResponse;
    } catch (err) {
      throw err;
    }
  }

  /**
   * rating order
   * @param {Object} orderRequest
   */
  async bppOnRatingResponse(uri,orderRequest) {
    try {
      const { context: requestContext = {}, message } =
        orderRequest || {};
      const parentOrderId = requestContext?.transaction_id;
      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.ON_RATING,
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

      const bppResponse = await bppRatingService.bppOnRatingResponse(
        uri,
        context,
        message
      );
      return bppResponse;
    } catch (err) {
      throw err;
    }
  }

   /**
   * get Bap Rating Categories
   * @param {Object} orderRequest
   */
   async getBapRatingCategories(orderRequest) {
    try {

      const { context: requestContext = {}} = orderRequest || {};

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
                domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.RATING,
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
      

      const bppCategoriesResponse = await bppRatingService.getBppRatingCategoriesService(
        requestContext.bpp_uri,
        context
      );

      return bppCategoriesResponse;
    } catch (err) {
      throw err;
    }
  }

  /**
   * get Bap Feedback Categories
   * @param {Object} orderRequest
   */
   async getBapFeedbackCategories(orderRequest) {
    try {

      const { context: requestContext = {}} = orderRequest || {};

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.RATING,
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
      

      const bppCategoriesResponse = await bppRatingService.getBppFeedbackCategoriesService(
        requestContext.bpp_uri,
        context
      );

      return bppCategoriesResponse;
    } catch (err) {
      throw err;
    }
  }

  /**
   * get Bap Feedback Categories
   * @param {Object} orderRequest
   */
   async getBapFeedbackForm(orderRequest) {
    try {

      const { context: requestContext = {},message} = orderRequest || {};
      const parentOrderId = requestContext?.transaction_id;

      const contextFactory = new ContextFactory();
      const context = contextFactory.create({
        domain: requestContext.domain ? requestContext.domain : process.env.DOMAIN,
                country: requestContext.country ? requestContext.country : process.env.COUNTRY,
                city: requestContext.city ? requestContext.city : process.env.CITY,
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.RATING,
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

      const bppCategoriesResponse = await bppRatingService.getBppFeedbackFormService(
        requestContext.bpp_uri,
        context,
        message,
      );

      return bppCategoriesResponse;
    } catch (err) {
      throw err;
    }
  }


  
}

export default RatingService;
