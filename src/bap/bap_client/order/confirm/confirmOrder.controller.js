import JsonWebToken from '../../../../shared/lib/authentication/json-web-token.js';
import ConfirmOrderService from './confirmOrder.service.js';

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

const confirmOrderService = new ConfirmOrderService();
const jsonWebToken = new JsonWebToken();
class ConfirmOrderController {

    /**
    * confirm order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async confirmOrder(req, res, next) {
        const { body: orderRequest } = req;
        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
        let createdBy =decoded?.ID || 1
    
        confirmOrderService.confirmOrder(orderRequest,createdBy).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * confirm multiple orders
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    confirmMultipleOrder(req, res, next) {
        const { body: requests } = req;
        // console.log("Harnath 1111");

        let length = requests.length;
        let requestArray = [];
        // console.log("Harnath 2222");
        
        if ( typeof length == 'undefined') {
            requestArray.push(requests);
        }
        else{
            requestArray = requests
        }
        // console.log("Harnath 3333");

        confirmOrderService.confirmMultipleOrder(requestArray).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });
    }
}

export default ConfirmOrderController;
