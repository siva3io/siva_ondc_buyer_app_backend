import RatingService from './rating.service.js';
import BadRequestParameterError from '../../shared/lib/errors/bad-request-parameter.error.js';
import { isSignatureValid } from '../../shared/utils/cryptic.js';
import messages from '../../shared/utils/messages.js';
import { SUBSCRIBER_TYPE } from '../../shared/utils/constants.js';
import BppRatingService from './bppRating.service.js';

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

const ratingService = new RatingService();

class RatingController {

    /**
    * rating order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    BapRating(req, res, next) {
        const { body: ratingRequest } = req;
        ratingService.BapRating(ratingRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

     /**
    * rating order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
      ONDCRatingOrder(req, res, next) {
        const { body: ratingRequest } = req;

        ratingService.ONDCRatingOrder(ratingRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }
    
    /**
    * bpp rating Order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
     bppRating(req, res, next) {
        var proxy_auth = ""

        if(req.body.context.bpp_id == process.env.BPP_ID) {
            proxy_auth = req.headers["authorization"]?.toString() || "";
        }

        isSignatureValid(proxy_auth, req.body).then((isValid) => {
            if(!isValid) {
                return res.status(401)
                .json({ message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "BAP", "code": "10001", "message": "Invalid Signature" } } 
                    })
            } else {
                res.status(200).send(messages.getAckResponse(req.body.context));
                const end_point = req.body.context.bap_uri;
                ratingService.bppOnRatingResponse(end_point, req.body);
            }
        })
    }
    
    
    
    
    
    /**
    * rating order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    rating(req, res, next) {
        const { body: ratingRequest } = req;

        if(ratingRequest.context.bpp_id) {
            ratingService.rating(ratingRequest).then(response => {
                res.json({ ...response });
            }).catch((err) => {
                next(err);
            });
        } else {
            throw new BadRequestParameterError("BPP Id is mandatory");
        }
    }

    /**
    * Rating multiple orders
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    ratingMultipleOrder(req, res, next) {
        const { body: ratingRequests } = req;

        if (ratingRequests && ratingRequests.length) {
            ratingService.ratingMultipleOrder(ratingRequests).then(response => {
                res.json(response);
            }).catch((err) => {
                next(err);
            });
        }
        else
            throw new BadRequestParameterError();
    }

    /**
    * on rating order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onRating(req, res, next) {
        const { query } = req;
        const { messageId } = query;
        
        if(messageId && messageId.length)
            ratingService.onRating(messageId).then(response => {
                res.json(response);
            }).catch((err) => {
                next(err);
            });
        else
            throw new BadRequestParameterError("message Id is mandatory");
    }

    /**
    * on rating multiple order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onRatingMultipleOrder(req, res, next) {
        const { query } = req;
        const { messageIds } = query;
        
        if(messageIds && messageIds.length && messageIds.trim().length) { 
            const messageIdArray = messageIds.split(",");
            
            ratingService.onRatingMultipleOrder(messageIdArray).then(response => {
                res.json(response);
            }).catch((err) => {
                next(err);
            });
            
        }
        else
            throw new BadRequestParameterError();
    }

    /**
    * get Bap Rating Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapRatingCategories(req, res, next) {
        const { body: ratingCategoriesRequest } = req;

        ratingService.getBapRatingCategories(ratingCategoriesRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * get Bap Feedback Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapFeedbackCategories(req, res, next) {
        const { body: feedbackCategoriesRequest } = req;

        ratingService.getBapFeedbackCategories(feedbackCategoriesRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

        /**
    * get Bap Feedback Form
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapFeedbackForm(req, res, next) {
        const { body: feedbackFormRequest } = req;

        ratingService.getBapFeedbackForm(feedbackFormRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }
    
    

    /**
    * get BPP Rating Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
     getBppRatingCategories(req, res, next) {
        var proxy_auth = ""
  
        if(req.body.context.bpp_id == process.env.BPP_ID) {
            proxy_auth = req.headers["authorization"]?.toString() || "";
        } else {
            proxy_auth = req.headers["x-gateway-authorization"]?.toString() || "";
        }
  
        const root = this
  
        isSignatureValid(proxy_auth, req.body, SUBSCRIBER_TYPE.BAP).then(async (isValid) => {
            if(!isValid) {
                return res.status(401)
                .setHeader('Proxy-Authenticate', proxy_auth)
                .json({ message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "Gateway", "code": "10001", "message": "Invalid Signature" } } 
                    })
            } else {
               
                res.status(200).send(messages.getAckResponse(req.body.context));
                const end_point = req.body.context.bap_uri;
                const context = req.body.context
                // bppRatingService.getBppRatingCategoriesService(
                //   requestContext.bpp_uri,
                //   context
                // );
                // searchService.bppOnSearchResults(end_point, req, "search");
                bppRatingService.BppRatingCategoriesService(end_point, context);
            }
        })
    }

     /**
    * get Bpp Feedback Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
   getBppFeedbackCategories(req, res, next) {
    var proxy_auth = ""

    if(req.body.context.bpp_id == process.env.BPP_ID) {
        proxy_auth = req.headers["authorization"]?.toString() || "";
    } else {
        proxy_auth = req.headers["x-gateway-authorization"]?.toString() || "";
    }

    const root = this

    isSignatureValid(proxy_auth, req.body, SUBSCRIBER_TYPE.BAP).then(async (isValid) => {
        if(!isValid) {
            return res.status(401)
            .setHeader('Proxy-Authenticate', proxy_auth)
            .json({ message : { 
                    "ack": { "status": "NACK" },  
                    "error": { "type": "Gateway", "code": "10001", "message": "Invalid Signature" } } 
                })
        } else {
            
            res.status(200).send(messages.getAckResponse(req.body.context));
            const end_point = req.body.context.bap_uri;
            const context = req.body.context
            // bppRatingService.getBppRatingCategoriesService(
            //   requestContext.bpp_uri,
            //   context
            // );
            // searchService.bppOnSearchResults(end_point, req, "search");
            bppRatingService.BppFeedbackCategoriesService(end_point, context);
        }
    })
}

    /**
    * get Bpp Feedback Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
  getBppFeedbackForm(req, res, next) {
    var proxy_auth = ""

    if(req.body.context.bpp_id == process.env.BPP_ID) {
        proxy_auth = req.headers["authorization"]?.toString() || "";
    } else {
        proxy_auth = req.headers["x-gateway-authorization"]?.toString() || "";
    }

    const root = this

    isSignatureValid(proxy_auth, req.body, SUBSCRIBER_TYPE.BAP).then(async (isValid) => {
        if(!isValid) {
            return res.status(401)
            .setHeader('Proxy-Authenticate', proxy_auth)
            .json({ message : { 
                    "ack": { "status": "NACK" },  
                    "error": { "type": "Gateway", "code": "10001", "message": "Invalid Signature" } } 
                })
        } else {
            
            res.status(200).send(messages.getAckResponse(req.body.context,req.body.message));
            const end_point = req.body.context.bap_uri;
            const context = req.body.context
            // bppRatingService.getBppRatingCategoriesService(
            //   requestContext.bpp_uri,
            //   context
            // );
            // searchService.bppOnSearchResults(end_point, req, "search");
            bppRatingService.BppFeedbackFormService(end_point, context,req.body.message);
        }
    })
  }
    
    
}

export default RatingController;