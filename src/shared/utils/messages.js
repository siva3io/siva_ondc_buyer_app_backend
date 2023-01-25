import moment from 'moment';

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

const MESSAGES = {
    NOTIFICAION_NOT_FOUND: 'Notification does not exist',
    ORDER_NOT_EXIST:'Order not exist',
    PAYMENT_FAILED :'Refund Payment Failed'
};

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

function getAckResponse(context) {
    const message = {
        "ack": {
          "status": "ACK"
        }
      }
    const ack = {};
    ack.context = context;
    ack.context.timestamp = new Date().toISOString();
    ack.message = message;

    return ack;
}

function getNackResponse(context) {
    const message = {
        "ack": {
          "status": "NACK", "code": "10001"
        }
      }
    const ack = {};
    ack.context = context;
    ack.context.timestamp = new Date().toISOString();
    ack.message = message;

    return ack;
}

export default { MESSAGES, formatMessage,  getAckResponse, getNackResponse};