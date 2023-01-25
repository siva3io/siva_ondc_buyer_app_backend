import fetch from "node-fetch";

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

class FetchRequest {

    /**
     * @param {*} baseUrl Base URL(domain url)
     * @param {*} url Resource URL
     * @param {*} method HTTP method(GET | POST | PUT | PATCH | DELETE)
     * @param {*} headers HTTP request headers
     * @param {*} data HTTP request data (If applicable)
     */
    constructor(baseUrl, url, method = 'get', body = {}, headers = {}) {
        this.baseUrl = baseUrl;
        this.url = url;
        this.method = method;
        this.headers = headers;
        this.body = body;
    };

    /**
     * Send http request to server to write data to / read data from server
     */
    async send() 
    {
        try 
        {
            let headers = { 'Accept': 'application/json', 'Content-Type': 'application/json', ...this.headers};

            let options = {
                method: this.method,
                headers: {
                    ...headers
                }
            };

            if(this.method.toLowerCase() !== "get") {
                options = {
                    ...options, 
                    body: {
                        ...this.body
                    }
                }
            }

            const response = await fetch(this.baseUrl + this.url, options);
            
            const data = await response.json();
            
            return data;
        } 
        catch (err) 
        {
            throw err;
        }
    };
}

export default FetchRequest;
