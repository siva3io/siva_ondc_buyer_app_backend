import { bppProtocolOnRating, protocolRating, bppProtocolRatingCategories, protocolGetRatingCategories, protocolGetFeedbackCategories,bppProtocolFeedbackCategories,protocolGetFeedbackForm,bppProtocolFeedbackForm } from "../../shared/utils/protocolApis/index.js";
import { produceKafkaEvent, kafkaClusters } from '../../shared/eda/kafka.js'
import { topics } from '../../shared/eda/consumerInit/initConsumer.js'
import { redisSubscribe } from "../../shared/database/redis.js";

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
class BppRatingService {
    
    /**
    * bpp on rating order
    * @param {Object} context
    * @param {Object} request
    */
     async bppOnRatingResponse(uri, context, request = {}) {
        try {
            const ratingRequest = {
              context: context,
              message:  {
                feedback_ack: true,
                rating_ack: true
              },
            
           
            }
            await bppProtocolOnRating(uri, ratingRequest);
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * getratingcategories
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
     async getBppRatingCategoriesService(uri, context = {}) {
        try {

            const getRatingCategoriesRequest = {
                context: context
            }
                        
            const response = await protocolGetRatingCategories(uri, getRatingCategoriesRequest);
            
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }
    
    /**
     * getratingcategories
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
     async getBppFeedbackCategoriesService(uri, context = {}) {
        try {

            const getFeedbackCategoriesRequest = {
                context: context
            }
                        
            const response = await protocolGetFeedbackCategories(uri, getFeedbackCategoriesRequest);
            
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * getratingcategories
     * @param {Object} context 
     * @param {Object} message 
     * @returns 
     */
     async getBppFeedbackFormService(uri, context = {}, message = {}) {
        try {

            const getFeedbackFormRequest = {
                context: context,
                message: {
                    rating_value:message.rating_value,
                    rating_category:message.rating_category
                }
            }
                        
            const response = await protocolGetFeedbackForm(uri, getFeedbackFormRequest);
            
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }
    
    

    /**
     * rating
     * @param {Object} context 
     * @param {Object} message 
     * @returns 
     */
    async BapRating(uri, context = {}, message) {
        try {
            const ratingRequest = {
                context: context,
                message: {
                    rating_category: message.rating_category,
                    id: message.id,
                    value: message.value,
                    feedback_form: message.feedback_form,
                    feedback_id: message.feedback_id
                }
            }
            let topic = process.env.KAFKA_TOPIC_PREFIX + '.' +topics.CLIENT_API_BAP_RATING

            await produceKafkaEvent(topic, ratingRequest)
           
            let response = await redisSubscribe(ratingRequest.context.message_id) 

            // const response = await protocolRating(uri, ratingRequest);
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }
    

    /**
     * bpp get rating categories
     * @param {Object} context 
=     * @returns 
     */
     async BppRatingCategoriesService(uri, context = {}) {
        try {
            const ratingCategoriesRequest = {
                context: context,
                rating_categories: ["order", "product", "fulfillment"]//todo
            }
            const response = await bppProtocolRatingCategories(uri, ratingCategoriesRequest);
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }

        /**
     * bpp get feedback categories
     * @param {Object} context 
=     * @returns 
     */
async BppFeedbackCategoriesService(uri, context = {}) {
    try {
        const feedbackCategoriesRequest = {
            context: context,
            feedback_categories: ["order", "product", "fulfillment"]//todo
        }
        const response = await bppProtocolFeedbackCategories(uri, feedbackCategoriesRequest);
        return { context: context, message: response.message };
    }
    catch (err) {
        throw err;
    }
}

        /**
     * bpp get feedback form
     * @param {Object} context 
     * @param {Object} data 
=     * @returns 
     */
async BppFeedbackFormService(uri, context = {}, data = {}) {
    try {
        const feedbackFormRequest = {
            context: context,
            message: {"feedback_form": [
                {
                  "id": "sample_radio",
                  "parent_id": "sample_parent",
                  "question": "What is your sample feedback?",
                  "answer": "",
                  "answer_type": "radio"
                },
                {
                    "id": "sample_checkbox",
                    "parent_id": "sample_parent",
                    "question": "What is your sample feedback?",
                    "answer": "",
                    "answer_type": "checkbox"
                  },
                  {
                    "id": "sample_text",
                    "parent_id": "sample_parent",
                    "question": "What is your sample feedback?",
                    "answer": "",
                    "answer_type": "text"
                  }

              ],
              "feedback_url": {
                "url": "sample url",
                "tl_method": "http/get",
                "params": {
                  "feedback_id": "sample_id",
                  "additionalProp1": "prop1",
                  "additionalProp2": "prop2",
                  "additionalProp3": "prop3"
                }
              }
            }
            //TODO:data:data (based on this data it should be generated)

        }
        const response = await bppProtocolFeedbackForm(uri, feedbackFormRequest);
        return { context: context, message: response.message };
    }
    catch (err) {
        throw err;
    }
}

    

     /**
     * rating
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
    async ONDCRating(uri, ratingRequest) {
        try {       

            let topic = topics.BAP_BPP_RATING

            await produceKafkaEvent(kafkaClusters.BG, topic, {uri, ratingRequest})
           
            produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, ratingRequest)


            let response = await redisSubscribe(ratingRequest.context.message_id)
      
            // const response = await protocolRating(uri, ratingRequest);
            
            return { context: response.context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }

         /**
     * rating
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
         async ONDCRatingCategories(uri, ratingRequest) {
            try {       
    
                let topic = topics.BAP_BPP_RATING_CATEGORIES
    
                await produceKafkaEvent(kafkaClusters.BG, topic, {uri, ratingRequest})
               
                produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, ratingRequest)
    
    
                let response = await redisSubscribe(ratingRequest.context.message_id)
          
                // const response = await protocolRating(uri, ratingRequest);
                
                return { context: response.context, message: response.message };
            }
            catch (err) {
                throw err;
            }
        }

        /**
     * rating
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
        async ONDCFeedbackCategories(uri, ratingRequest) {
            try {       
    
                let topic = topics.BAP_BPP_FEEDBACK_CATEGORIES
    
                await produceKafkaEvent(kafkaClusters.BG, topic, {uri, ratingRequest})
               
                produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, ratingRequest)
    
    
                let response = await redisSubscribe(ratingRequest.context.message_id)
          
                // const response = await protocolRating(uri, ratingRequest);
                
                return { context: response.context, message: response.message };
            }
            catch (err) {
                throw err;
            }
        }

        /**
     * rating
     * @param {Object} context 
     * @param {String} refObj 
     * @returns 
     */
        async ONDCFeedbackForm(uri, ratingRequest) {
            try {       
    
                let topic = topics.BAP_BPP_FEEDBACK_FORM
    
                await produceKafkaEvent(kafkaClusters.BG, topic, {uri, ratingRequest})
               
                produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, ratingRequest)
    
    
                let response = await redisSubscribe(ratingRequest.context.message_id)
          
                // const response = await protocolRating(uri, ratingRequest);
                
                return { context: response.context, message: response.message };
            }
            catch (err) {
                throw err;
            }
        }

        

        async ONDCRatingCategoriesEvent({uri, ratingRequest}) {
            try {       
                const response = await protocolGetRatingCategories(uri, ratingRequest);
                
                return response;
            }
            catch (err) {
                throw err;
            }
        }

        async ONDCFeedbackCategoriesEvent({uri, ratingRequest}) {
            try {       
                const response = await protocolGetFeedbackCategories(uri, ratingRequest);
                
                return response;
            }
            catch (err) {
                throw err;
            }
        }


        async ONDCFeedbackFormEvent({uri, ratingRequest}) {
            try {       
                const response = await protocolGetFeedbackForm(uri, ratingRequest);
                
                return response;
            }
            catch (err) {
                throw err;
            }
        }

    async ONDCRatingEvent({uri, ratingRequest}) {
        try {       
            
            const response = await protocolRating(uri, ratingRequest);
            
            return response;
        }
        catch (err) {
            throw err;
        }
    }
}

export default BppRatingService;
