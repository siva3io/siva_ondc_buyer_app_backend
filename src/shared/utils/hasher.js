import bcrypt from 'bcrypt';

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

const SALT_WORK_FACTOR = 10;

const Hash = (password) => {

    return new Promise((resolve, reject) => {
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return reject(err);
            bcrypt.hash(password, salt, function(err, hash) {
                if (err) return reject(err);
                resolve(hash)
            });
        });
    })
}

const VerifyHash = (input, password) => {

    return new Promise((resolve, reject) => {
        bcrypt.compare(input, password, function(err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
}

export { Hash, VerifyHash }