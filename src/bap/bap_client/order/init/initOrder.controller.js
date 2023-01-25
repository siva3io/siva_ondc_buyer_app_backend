import InitOrderService from './initOrder.service.js';
import JsonWebToken from '../../../../shared/lib/authentication/json-web-token.js'; 

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

const initOrderService = new InitOrderService();
const jsonWebToken = new JsonWebToken();

class InitOrderController {

    /**
    * init order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async initOrder(req, res, next) {
        const { body: orderRequest } = req;
        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
        const company_id = decoded?.company_id || 1

        initOrderService.initOrder(orderRequest, company_id, req.headers.authorization).then(response => {
        if(response?.error){
            res.status(401)
        }
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * init multiple orders
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async initMultipleOrder(req, res, next) {
        const { body: requests} = req;

        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
        const company_id = decoded?.company_id || 1

        let length = requests.length;
        let requestArray = [];

        if ( typeof length == 'undefined') {
            requestArray.push(requests);
        }
        else{
            requestArray = requests
        }

        await initOrderService.initMultipleOrder(requestArray, company_id).then(response => {
            return res.json(response);
        }).catch((err) => {
            // console.log("inintOrder.controller.js 59");
            next(err);
        });

    }
}

export default InitOrderController;
