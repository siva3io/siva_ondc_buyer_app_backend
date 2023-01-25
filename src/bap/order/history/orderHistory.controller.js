import OrderHistoryService from './orderHistory.service.js';
import BadRequestParameterError from '../../../shared/lib/errors/bad-request-parameter.error.js';

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

const orderHistoryService = new OrderHistoryService();

class OrderHistoryController {
    
    /**
    * get order list
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getOrdersList(req, res, next) {
        const { query = {}, user } = req;

        const { pageNumber = 1 } = query;

        if(pageNumber > 0) {
            orderHistoryService.getOrdersList(user, query).then(response => {
                if(!response.error) {
                    res.json({ ...response });
                }
                else
                    res.status(404).json(
                        {
                            totalCount: 0,
                            orders: [],
                            error: response.error,
                        }
                    );
            }).catch((err) => {
                next(err);
            });
        }
        else
            throw new BadRequestParameterError();
    }
}

export default OrderHistoryController;
