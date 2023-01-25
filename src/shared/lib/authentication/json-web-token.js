import jwt from 'jsonwebtoken'

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

class JsonWebToken {
    /**
     *
     * @param {*} options JWT options
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Sign JWT token
     * @param {*} token Instance of Token class
     */
    sign(token) {
        return new Promise((resolve, reject) => {
            jwt.sign(token.payload, this.options.secret, {expiresIn: token.exp}, function (err, token) {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            });
        })
    }

    /**
     * Verify JWT token
     * @param {} jwtToken JWT token in String format
     */
    verify(jwtToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(jwtToken, process.env.JWT_SECRET, function (err, decoded) {
                if (err) {
                    // console.log(err);
                } else {
                    resolve(decoded)
                }
            });
        })
    }
}

export default JsonWebToken;