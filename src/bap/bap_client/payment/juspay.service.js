import NodeRSA from "node-rsa";
import fs from "fs";
import util from "util";
import MESSAGES from "../../../shared/utils/messages.js";
import { PAYMENT_TYPES, PROTOCOL_CONTEXT, PROTOCOL_PAYMENT, SUBSCRIBER_TYPE } from "../../../shared/utils/constants.js";

// import { accessSecretVersion } from "../utils/accessSecretKey.js";
import { getJuspayOrderStatus } from "../../../shared/utils/juspayApis.js";
import { addOrUpdateOrderWithTransactionId, getOrderByTransactionId } from "../../../shared/db/dbService.js";
import { NoRecordFoundError } from "../../../shared/lib/errors/index.js";

import ContextFactory from "../../../shared/factories/ContextFactory.js";
import BppConfirmService from "../order/confirm/bppConfirm.service.js";

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

const bppConfirmService = new BppConfirmService();

const readFile = util.promisify(fs.readFile);
class JuspayService {

    /**
    * sign payload using juspay's private key
    * @param {Object} data
    */
    async signPayload(data) {
        try {
            const { payload } = data;
            let result = null;

            if (payload) {
                // const privateKeyHyperBeta = await accessSecretVersion(process.env.JUSPAY_SECRET_KEY_PATH);
                const privateKeyHyperBeta = await readFile(process.env.JUSPAY_SECRET_KEY_PATH, 'utf-8');

                const encryptKey = new NodeRSA(privateKeyHyperBeta, 'pkcs1');
                result = encryptKey.sign(payload, 'base64', 'utf8');
            }
            return result;

        }
        catch (err) {
            throw err;
        }
    }

    /**
    * get order status
    * @param {Object} data
    */
    async getOrderStatus(orderId) {
        try {
            let paymentDetails = await getJuspayOrderStatus(orderId);

            if (!paymentDetails)
                throw new NoRecordFoundError(MESSAGES.ORDER_NOT_EXIST);

            return paymentDetails;
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * verify payment webhook
    * @param {Object} data
    */
    async verifyPayment(data) {
        try {
            const { date_created, event_name, content = {} } = data || {};
            const { order = {} } = content || {};
            const { amount, order_id } = order;

            let status = PROTOCOL_PAYMENT["NOT-PAID"];

            switch (event_name) {
                case "ORDER_SUCCEEDED":
                    status = PROTOCOL_PAYMENT.PAID;
                    break;
                case "ORDER_FAILED":

                    break;
                case "ORDER_AUTHORIZED":

                    break;
                default:
                    break;
            };

            const orderRequest = {
                payment: {
                    paid_amount: amount,
                    status: status,
                    transaction_id: order_id,
                    type: PAYMENT_TYPES["ON-ORDER"],
                }
            };

            const dbResponse = await getOrderByTransactionId(order_id);

            if (dbResponse?.paymentStatus === null || dbResponse?.paymentStatus !== status) {

                const contextFactory = new ContextFactory();
                const context = contextFactory.create({
                    action: PROTOCOL_CONTEXT.CONFIRM,
                    transactionId: order_id,
                    bppId: dbResponse.bppId
                });

                const bppConfirmResponse = await bppConfirmService.confirmV2(
                    context,
                    orderRequest,
                    dbResponse
                );

                if (bppConfirmResponse?.message?.ack) {
                    let orderSchema = dbResponse?.toJSON();
                    orderSchema.messageId = bppConfirmResponse?.context?.message_id;
                    orderSchema.paymentStatus = status;

                    await addOrUpdateOrderWithTransactionId(
                        bppConfirmResponse?.context?.transaction_id,
                        { ...orderSchema }
                    );
                }
            }

            return;
        }
        catch (err) {
            throw err;
        }
    }

}

export default JuspayService;
