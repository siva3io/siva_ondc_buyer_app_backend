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

import { UnauthenticatedError } from '../lib/errors/index.js';
import MESSAGES from '../../shared/utils/messages.js';
import HttpRequest from "../utils/HttpRequest.js";
// import redisConnect from "../database/redisConnector.js";

import { redisClient } from "../database/redis.js";

async function  authentication(req, res, next) {
    const authToken = req.headers.authorization;
    // checking for authHeader
    var idToken = ""
    try{
        idToken = authToken.split(" ")[1];
    }
    catch(err) {
        next(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID));
    }
    if (authToken) {
        // checking for authHeader in redis 
        // var time = await (await redisConnect()).get(idToken);
        // var time = await redisClient.get(idToken)
        // if (time) {
            
        //     var millSec = new Date() - new Date(time);
        //     var sec = millSec/1000
        //     var maxSec = process.env.SSO_LOGIN_TOKEN_EXP_SEC || 86400;
            
        //     if (Number(sec) > Number(maxSec)){
        //         next(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID)); 
        //     }
        //     next();
        // }
        // else{
        //     var uri = process.env.EUNIMART_CORE_HOST;
        //     var baseURL = process.env.USER_HEALTH_CHECK_BASE_PATH;
            
        //     const apiCall = new HttpRequest(uri,
        //         baseURL,
        //         "GET",
        //         {},
        //         {
        //             "Authorization": authToken,
        //             "Accept": "application/json"
        //         }
        //     );
        //     try{
        //         const result = await apiCall.send();
        //         await redisClient.set(idToken, new Date().toISOString());
        //         next();
        //     }
        //     catch(err) {
        //         next(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID));
        //     }
        // }
        next();        
    }
    else {
        next(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID));
    }
};

export default authentication;