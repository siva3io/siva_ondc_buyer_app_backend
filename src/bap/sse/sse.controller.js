import BadRequestParameterError from '../../shared/lib/errors/bad-request-parameter.error.js';
import { addSSEConnection } from '../../shared/utils/sse.js';

import SseProtocol from './sseProtocol.service.js';
import ConfigureSse from "./configureSse.service.js";
import CustomLogs from '../../shared/utils/customLogs.js';
import { PROTOCOL_CONTEXT, SUBSCRIBER_TYPE, PAYMENT_COLLECTED_BY_STATUS } from '../../shared/utils/constants.js';
import { getSubscriberType } from '../../shared/utils/registryApis/registryUtil.js';

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

const sseProtocolService = new SseProtocol();

class SseController {

    /**
    * on event 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async onEvent(req, res, next) {


        try {
            const { query = {} } = req;
            const { messageId, action } = query;

            if (messageId && messageId.length) {

                var time = 2000
                if (action == 'on_search'){
                    time = 10000
                }
                else{
                    time = 5000
                }
                
                const configureSse = new ConfigureSse(req, res, messageId, time);
                const initSSE = configureSse.initialize();
                
                addSSEConnection(messageId, initSSE);

            }

        }
        catch (err) {
            throw err;
        }
    }

    /**
    * on cancel 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onCancel(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_CANCEL, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onCancel(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * on confirm 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onConfirm(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_CONFIRM, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onConfirm(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });     
    }

    /**
    * on init 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onInit(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_INIT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onInit(response).then(result => {
            var collected_by_status = result?.message?.order?.payment["@ondc/org/ondc-collected_by_status"]
            

            if (collected_by_status == PAYMENT_COLLECTED_BY_STATUS.DISAGREE || PAYMENT_COLLECTED_BY_STATUS.TERMINATE){
                var nack_res = { message : { 
                    "ack": { "status": "NACK" },  
                    "error": { "type": "BAP", "code": "10001", "message": "The transaction failed to complete because a payment collector could not be identified" } } 
                }
                res.json(nack_res) 
            }
            else if (collected_by_status ==  PAYMENT_COLLECTED_BY_STATUS.ASSERT){
                // need to recreate init request again with collected_by
                // var collected_by = result?.message?.payment?.collected_by

            }            
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * on search 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onSearch(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_SEARCH, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onSearch(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * on search 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
     onSelect(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_SELECT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onSelect(response).then(result => {
            res.json(result);
        }).catch((err) => {
            // console.log(err)
            next(err);
        });
    }

    /**
    * on quote 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onQuote(req, res, next) {
        const { body: response } = req;

        sseProtocolService.onQuote(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * on status 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onStatus(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_STATUS, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onStatus(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * on support 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onSupport(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_SUPPORT, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onSupport(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

        /**
    * on rating 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
         onRating(req, res, next) {
            const { body: response } = req;
    
            sseProtocolService.onRating(response).then(result => {
                res.json(result);
            }).catch((err) => {
                next(err);
            });
        }

                /**
    * on bpp issue 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
        onBppIssue(req, res, next) {
        const { body: response } = req;

        sseProtocolService.onBppIssue(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

                    /**
    * on bap issue 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
        onBapIssue(req, res, next) {
            const { body: response } = req;
    
            sseProtocolService.onBapIssue(response).then(result => {
                res.json(result);
            }).catch((err) => {
                next(err);
            });
        }

    /**
    * on rating 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onIssueStatus(req, res, next) {
        const { body: response } = req;

        sseProtocolService.onIssueStatus(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }
    
        

    /**
    * on track 
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onTrack(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_TRACK, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onTrack(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    onUpdate(req, res, next) {
        const { body: response } = req;

        CustomLogs.writeRetailLogsToONDC(JSON.stringify(response), PROTOCOL_CONTEXT.ON_UPDATE, getSubscriberType(SUBSCRIBER_TYPE.BAP))

        sseProtocolService.onUpdate(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    ratingCategories(req, res, next) {
        const { body: response } = req;

        sseProtocolService.ratingCategories(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    feedbackCategories(req, res, next) {
        const { body: response } = req;

        sseProtocolService.feedbackCategories(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

    feedbackForm(req, res, next) {
        const { body: response } = req;

        sseProtocolService.feedbackForm(response).then(result => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    }

}

export default SseController;
