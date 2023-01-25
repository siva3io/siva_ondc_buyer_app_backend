import { protocolGetRatingCategories, protocolGetFeedbackCategories,protocolGetFeedbackForm } from "../../../shared/utils/protocolApis/index.js";
import { produceKafkaEvent, kafkaClusters } from '../../../shared/eda/kafka.js'
import { topics } from '../../../shared/eda/consumerInit/initConsumer.js'
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
class BppRatingService {

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
                      
            let topic = topics.CLIENT_API_BAP_RATING_CATEGORIES

            await produceKafkaEvent(kafkaClusters.BAP, topic, getRatingCategoriesRequest)
           
            let response = await redisSubscribe(getRatingCategoriesRequest.context.message_id) 
            // const response = await protocolGetRatingCategories(uri, getRatingCategoriesRequest);
            
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

            let topic = topics.CLIENT_API_BAP_FEEDBACK_CATEGORIES
                        
            await produceKafkaEvent(kafkaClusters.BAP, topic, getFeedbackCategoriesRequest)
           
            let response = await redisSubscribe(getFeedbackCategoriesRequest.context.message_id)
            // const response = await protocolGetFeedbackCategories(uri, getFeedbackCategoriesRequest);
            
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
            let topic = topics.CLIENT_API_BAP_FEEDBACK_FORM
                        
            await produceKafkaEvent(kafkaClusters.BAP, topic, getFeedbackFormRequest)
           
            let response = await redisSubscribe(getFeedbackFormRequest.context.message_id)
                        
            // const response = await protocolGetFeedbackForm(uri, getFeedbackFormRequest);
            
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
            let topic = topics.CLIENT_API_BAP_RATING
            // console.log("rating req--->",ratingRequest)
            await produceKafkaEvent(kafkaClusters.BAP, topic, ratingRequest)
           
            let response = await redisSubscribe(ratingRequest.context.message_id) 

            // const response = await protocolRating(uri, ratingRequest);
            return { context: context, message: response.message };
        }
        catch (err) {
            throw err;
        }
    }
    

}

export default BppRatingService;
