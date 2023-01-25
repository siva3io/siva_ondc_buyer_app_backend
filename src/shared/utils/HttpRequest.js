import axios from 'axios';

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

/**
 * Used to communicate with server
 */
class HttpRequest {

    /**
     * @param {*} baseUrl Base URL(domain url)
     * @param {*} url Resource URL
     * @param {*} method HTTP method(GET | POST | PUT | PATCH | DELETE)
     * @param {*} headers HTTP request headers
     * @param {*} data HTTP request data (If applicable)
     * @param {*} options other params
     */
    constructor(baseUrl, url, method = 'get', data = {}, headers = {}, options) {
        this.baseUrl = baseUrl;
        this.url = url;
        this.method = method;
        this.data = data;
        this.headers = headers;
        this.options = options;
    };

    /**
     * Send http request to server to write data to / read data from server
     * axios library provides promise implementation to send request to server
     * Here we are using axios library for requesting a resource
     */
    async send() 
    {
    
        try 
        {
            let headers = {
                ...this.headers, 
                ...(this.method.toLowerCase() != "get" && {'Content-Type': 'application/json'})
            };
            
            let result;

            if (this.method.toLowerCase() == 'get') 
            {
                result = await axios({
                    baseURL: this.baseUrl,
                    url: this.url,
                    method: this.method,
                    headers: headers,
                    timeout: 180000, // If the request takes longer than `timeout`, the request will be aborted.
                });
            } 
            else 
            {
                // Make server request using axios
                result = await axios({
                    baseURL: this.baseUrl,
                    url: this.url,
                    method: this.method,
                    headers: headers,
                    timeout: 180000, // If the request takes longer than `timeout`, the request will be aborted.
                    data: JSON.stringify(this.data)
                });
            }
            return result;
        } 
        catch (err) 
        {

            if (err.response) {
                // The client was given an error response (5xx, 4xx)
            } else if (err.request) {
                // The client never received a response, and the request was never left
            } else {
                // Anything else
            }

            throw err;
        }
    };
}

export default HttpRequest;
