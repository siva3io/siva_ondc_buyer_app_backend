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

const appVersionValidator = (options) => (req, res, next) => {
    if (req.get('appVersion')) {
        const systemVersion = process.env.MIN_ALLOWED_APP_VERSION.split('.');
        const appVersion = req.get('appVersion').split('.');
        let version = 0;
        let system = 0;
        let multiplier = 100;
        let systemMultiplier = 100;
        for (let i = 0; i < appVersion.length; i++) {
            version += appVersion[i] * multiplier;
            multiplier = multiplier / 10;
        }

        for (let i = 0; i < systemVersion.length; i++) {
            system += systemVersion[i] * systemMultiplier;
            systemMultiplier = systemMultiplier / 10;
        }

        if (system <= version) {
            next();
        } else {
            res.status(426).send();
        }
    } else {
        next();
    }

};

export default appVersionValidator;