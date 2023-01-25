import _ from "lodash";
import { ORDER_STATUS } from "../../../shared/utils/constants.js";
import OrderMongooseModel from '../../../shared/db/order.js';

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

class OrderHistoryService {

    /**
     * 
     * @param {Object} user 
     * @param {String} orderId 
     * @param {String} parentOrderId 
     * @param {Number} skip 
     * @param {Number} limit 
     */
    async findOrders(user, params = {}) {
        try {
            let orders = [];
            let totalCount = 1;

            let {
                limit = 10,
                orderId,
                orderStatus,
                pageNumber = 1,
                parentOrderId,
                state,
                transactionId,
                userId
            } = params;


            limit = parseInt(limit);
            let skip = (pageNumber - 1) * limit;
            
            let clonedFilterObj = {};

            if (orderId)
                clonedFilterObj = { ...clonedFilterObj, id: { "$in": orderId.split(",") } };
            if (parentOrderId)
                clonedFilterObj = { ...clonedFilterObj, parentOrderId: { "$in": parentOrderId.split(",") } };
            if (transactionId)
                clonedFilterObj = { ...clonedFilterObj, transactionId: { "$in": transactionId.split(",") } };
            if (state) 
                clonedFilterObj = { ...clonedFilterObj, state: { "$in": state.split(",") } };
            if (userId)
                clonedFilterObj = { ...clonedFilterObj, userId: userId };

            if (_.isEmpty(clonedFilterObj))
                clonedFilterObj = { userId: user.decodedToken.uid };

            switch (orderStatus) {
                case ORDER_STATUS.COMPLETED:
                    clonedFilterObj = { ...clonedFilterObj, id: { "$ne": null } };
                    break;
                case ORDER_STATUS["IN-PROGRESS"]:
                    clonedFilterObj = { ...clonedFilterObj, id: { "$eq": null } };
                    break;
                default:
                    break;
            }
            
            orders = await OrderMongooseModel.find({ ...clonedFilterObj }).limit(limit).skip(skip);
            totalCount = await OrderMongooseModel.countDocuments({ ...clonedFilterObj });

            return { orders, totalCount };
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * get order list
    * @param {Object} params
    * @param {Object} user
    */
    async getOrdersList(user, params = {}) {
        try {
            const { orders, totalCount } = await this.findOrders(user, params);
            if (!orders.length) {
                return {
                    error: {
                        message: "No data found",
                        status: "BAP_010",
                    }
                };
            }
            else {
                return {
                    totalCount: totalCount,
                    orders: [...orders],
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
}

export default OrderHistoryService;
