import { produceKafkaEvent, kafkaClusters } from "../eda/kafka.js"
import { topics } from '../eda/consumerInit/initConsumer.js'

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

const SSE_CONNECTIONS = {};

/**
 * store sse connection object
 * @param {String} messageId
 * @param {Object} sse
 */
function addSSEConnection(messageId, sse) {
  if (!SSE_CONNECTIONS?.[messageId]) {
    SSE_CONNECTIONS[messageId] = sse;
  }
}

function sendSSEResponse(messageId, action, response, killProcess = false) {
  if (action != 'on_search') {
    produceKafkaEvent(kafkaClusters.WEB3, topics.WEB3_LIVE_FEED, response)
  }

  if (!SSE_CONNECTIONS?.[messageId]) {
    setTimeout(() => {
      SSE_CONNECTIONS?.[messageId]?.send(response, action, messageId);
    }, process.env.SSE_TIMEOUT);
    if (killProcess){
      delete SSE_CONNECTIONS[messageId]
    }
  } else {
    SSE_CONNECTIONS?.[messageId]?.send(response, action, messageId);
    if (killProcess){
      delete SSE_CONNECTIONS[messageId]
    }
  }
}

export { addSSEConnection, sendSSEResponse, SSE_CONNECTIONS };
