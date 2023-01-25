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
class Token {
    /**
     *
     * @param {*} payload token payload
     * @param {*} exp     token expiry
     */
    constructor(payload, exp) {
        this.payload = payload;
        this.exp = exp;
    }

    setPayload(payload) {
        this.payload = payload;
    }

    getPayload() {
        return this.payload;
    }

    setExp(exp) {
        this.exp = exp;
    }

    getExp() {
        return this.exp;
    }
}

export default Token;