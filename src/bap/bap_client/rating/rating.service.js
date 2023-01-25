import { PROTOCOL_CONTEXT } from "../../../shared/utils/constants.js";
import BppRatingService from "./bppRating.service.js";
import ContextFactory from "../../../shared/factories/ContextFactory.js";
import { v4 as uuidv4 } from 'uuid';

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
                bap_id: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bap_uri: requestContext.bap_uri ? requestContext.bap_uri : process.env.BAP_URL,
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
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.GET_RATING_CATEGORIES,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bap_id: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bap_uri: requestContext.bap_uri ? requestContext.bap_uri : process.env.BAP_URL,
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
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.GET_FEEDBACK_CATEGORIES,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bap_id: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bap_uri: requestContext.bap_uri ? requestContext.bap_uri : process.env.BAP_URL,
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
                action: requestContext.action ? requestContext.action : PROTOCOL_CONTEXT.GET_FEEDBACK_FORM,
                core_version: requestContext.core_version ? requestContext.core_version : PROTOCOL_CONTEXT.CORE_VERSION,
                ttl: requestContext.ttl ? requestContext.ttl : null,
                message_id: requestContext.message_id ? requestContext.message_id : uuidv4(),
                timestamp: requestContext.timestamp ? requestContext.timestamp  : new Date().toISOString(),
                transactionId: requestContext.transaction_id,
                bppId: requestContext.bpp_id,
                bppUrl: requestContext.bpp_uri,
                bap_id: requestContext.bap_id ? requestContext.bap_id : process.env.BAP_ID,
                bap_uri: requestContext.bap_uri ? requestContext.bap_uri : process.env.BAP_URL,
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
