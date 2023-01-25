import BillingService from './billing.service.js';
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
const billingService = new BillingService();

class BillingController {

    /**
    * add billing address
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    billingAddress(req, res, next) {
        const { body: request, user} = req;

        billingService.billingAddress(request, user).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * get billing address
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    onBillingDetails(req, res, next) {
        const { user } = req;

        billingService.onBillingDetails(user).then(order => {
            res.json(order);
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * update billing address
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    updateBillingAddress(req, res, next) {
        const { body: request, params } = req;
        const { id } = params;

        billingService.updateBillingAddress(id, request).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });
    }
}

export default BillingController;
