import passportJWT from 'passport-jwt';
import {UnauthenticatedError} from '../../errors/index.js';
import MESSAGES from '../../../utils/messages.js';
import {HEADERS} from "../../../../shared/utils/constants.js";

import HttpRequest from '../../../utils/HttpRequest.js';

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


const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const tokenExtractor = function (req) {

    let token = null;
    let tokenArray = []

    if (req) {
        token = req.get(HEADERS.ACCESS_TOKEN);

        tokenArray = token.split(" ");
    }
    
    return tokenArray[1];
};

const opts = {
    jwtFromRequest: tokenExtractor, 
    secretOrKey: "wftd3hg5$g67h*fd5h6fbvcy6rtg5wftd3hg5$g67h*fd5xxx",
    passReqToCallback: true
};

const passportJwtStrategy = new JwtStrategy(opts, async (req, jwtPayload, done) => {
    try {

        let user = {}

        
        // fetch user data from auth service
        let accessToken = req.get(HEADERS.ACCESS_TOKEN);

        
        let headers = {}
        headers[HEADERS.ACCESS_TOKEN] = accessToken

        let httpRequest = new HttpRequest(
            process.env.MODULE_END_POINT_AUTH,
            `/api/users/${jwtPayload.userId}/authUser`,
            "GET",
            {},
            headers
        );

        let result = await httpRequest.send();
        user = result.data.data;

        if (!user) {
            return done(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCESS_TOKEN_INVALID), null);
        } else if (user.enabled === false) {
            return done(new UnauthenticatedError(MESSAGES.LOGIN_ERROR_USER_ACCOUNT_DEACTIVATED), null);
        } else {
            return done(null, user);
        }
    } catch (err) {
        return done(err, null);
    }
});

export default passportJwtStrategy;
