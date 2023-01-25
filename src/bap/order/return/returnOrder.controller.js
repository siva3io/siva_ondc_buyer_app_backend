import ReturnOrderService from './returnOrder.service.js';
import BadRequestParameterError from '../../../shared/lib/errors/bad-request-parameter.error.js';
import { isSignatureValid } from '../../../shared/utils/cryptic.js';
import messages from '../../../shared/utils/messages.js';
import { getOrderByTransactionId } from '../../../shared/db/dbService.js';

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

const returnOrderService = new ReturnOrderService();

class ReturnOrderController {
    /**
    * return order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    returnOrder(req, res, next) {
        const { body :orderRequest } = req;

        returnOrderService.returnOrder(orderRequest).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });
    }


    /**
    * return order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
     ONDCReturnOrder(req, res, next) {
        const { body :orderRequest } = req;

        returnOrderService.ONDCReturnOrder(orderRequest).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });
    }


    /**
    * on return order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onReturnOrder(req, res, next) {
        const { query } = req;
        const { messageId } = query;
        
        if(messageId) {
            returnOrderService.onReturnOrder(messageId).then(order => {
                res.json(order);
            }).catch((err) => {
                next(err);
            });
        }
        else
            throw new BadRequestParameterError();

    }


    /**
    * select
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async bppReturnOrder(req, res, next) {
        var proxy_auth = ""

        if(req.body.context.bpp_id == process.env.BPP_ID) {
            proxy_auth = req.headers["authorization"]?.toString() || "";
        }

        const orderDetails = await getOrderByTransactionId(req.body.context.transaction_id);

        if (!orderDetails){
            return res.status(401)
                .setHeader('Proxy-Authenticate', proxy_auth)
                .json({ message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "BAP", "code": "10001", "message": "Invalid Signature" } } 
                    })
        }

        isSignatureValid(proxy_auth, req.body).then((isValid) => {
            if(!isValid) {
                return res.status(401)
                .setHeader('Proxy-Authenticate', proxy_auth)
                .json({ message : { 
                        "ack": { "status": "NACK" },  
                        "error": { "type": "BAP", "code": "10001", "message": "Invalid Signature" } } 
                    })
            } else {
                res.status(200).send(messages.getAckResponse(req.body.context));
                const end_point = req.body.context.bap_uri;
                returnOrderService.bppOnReturnOrderResponse(end_point, req.body);
            }
        })
    }

}

export default ReturnOrderController;
