import EventEmitter from 'events';
import _ from "lodash";

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

class SseEvent extends EventEmitter {

    constructor(initial, options = {}) {
        super();

        if (initial)
            this.initial = initial;
        else
            this.initial = [];

        if (!_.isEmpty(options))
            this.options = { ...options };
        else
            this.options = { isSerialized: true };

        this.init = this.init.bind(this);
    }

    /**
     * The SSE route handler
     */
    init(req, res, time) {
        let id = 0;

        req.socket.setTimeout(2*60*1000);
        req.socket.setNoDelay(true);
        req.socket.setKeepAlive(true);

        // res.statusCode = 200;

        res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            });

        // res.setHeader('Content-Type', 'text/event-stream');
        // res.setHeader('Connection', 'keep-alive');
        // res.setHeader('Cache-Control', 'no-cache');
        // res.setHeader('Access-Control-Allow-Origin', '*');
        // res.setHeader('Access-Control-Allow-Credentials', 'true');

        // if (req.httpVersion !== '2.0')
        //     res.setHeader('Connection', 'keep-alive');

        if (this.options.isCompressed)
            res.setHeader('Content-Encoding', 'deflate');

        // Increase number of event listeners on init
        this.setMaxListeners(this.getMaxListeners() + 10);

        const dataListener = data => {

            if (data.id)
                res.write(`id: ${data.id}\n`);
            else {
                res.write(`id: ${id}\n`);
                id += 1;
            }

            if (data.event)
                res.write(`event: ${data.event}\n`);

            res.write(`data: ${JSON.stringify(data.data)}\n\n`);
            setTimeout(() => {
                if (data.event !== "bppEunimartOrderConfirmSivaOndc") {
                    res.end();
                }
            }, time);
        };

        const serializeListener = data => {
            const serializeSend = data.reduce((all, msg) => {
                all += `id: ${id}\ndata: ${JSON.stringify(msg)}\n\n`;
                id += 1;
                return all;
            }, '');
            res.write(serializeSend);
        };

        this.on('data', dataListener);

        this.on('serialize', serializeListener);

        if (this.initial) {
            if (this.options?.isSerialized)
                this.serialize(this.initial);
            else if (!_.isEmpty(this.initial))
                this.send(this.initial,
                    this.options.initialEvent || false,
                    this.options.eventId
                );
        }

        // Remove listeners and reduce the number of max listeners on client disconnect
        req.on('close', () => {
            this.removeListener('data', dataListener);
            this.removeListener('serialize', serializeListener);
            this.setMaxListeners(this.getMaxListeners() - 2);
        });
    }

    /**
     * Update the data initially served by the SSE stream
     * @param {array} data array containing data to be served on new connections
     */
    updateInit(data) {
        this.initial =  data;
    }

    /**
     * Empty the data initially served by the SSE stream
     */
    dropInit() {
        this.initial = [];
    }

    /**
     * Send data to the SSE
     * @param {(object|string)} data Data to send into the stream
     * @param [string] event Event name
     * @param [(string|number)] id Custom event ID
     */
    send(data, event, id) {
        this.emit('data', { data, event, id });
    }

    /**
     * Send serialized data to the SSE
     * @param {array} data Data to be serialized as a series of events
     */
    serialize(data) {
        if (Array.isArray(data)) {
            this.emit('serialize', data);
        } else {
            this.send(data);
        }
    }
}

export default SseEvent;
