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

import { Authorisation } from '../lib/authorisation/index.js';

const authorisation = (options) => (req, res, next) => {
    const httpRequestMethod = req.method.toUpperCase();
    const authorisation = new Authorisation(req.user, httpRequestMethod, options.resource,options.roles);

    // If user is allowed to access given resource then moved to next function else forbid
    authorisation.isAllowed().then(permission => {
        req.permission = permission;
        next();
    }).catch(() => {
        res.status(403).send();
    });
};

export default authorisation;
