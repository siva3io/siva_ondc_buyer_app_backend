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
 *  Enumerates the possible actions of a role.
 *  An action defines the type of an operation that will be executed on a
 *  "resource" by a "role".
 *  This is known as CRUD (CREATE, READ, UPDATE, DELETE).
 *  @enum {String}
 *  @readonly
 *  @memberof! AccessControl
 */
const Action = {
    /**
     *  Specifies a CREATE action to be performed on a resource.
     *  For example, an HTTP POST request or an INSERT database operation.
     *  @type {String}
     */
    POST: 'CREATE',
    /**
     *  Specifies a READ action to be performed on a resource.
     *  For example, an HTTP GET request or an database SELECT operation.
     *  @type {String}
     */
    GET: 'READ',
    /**
     *  Specifies an full UPDATE action to be performed on a resource.
     *  For example, an HTTP PUT request or an database UPDATE operation.
     *  @type {String}
     */
    PUT: 'UPDATE',
    /**
     *  Specifies an partial UPDATE action to be performed on a resource.
     *  For example, an HTTP PATCH request or an database UPDATE operation.
     *  @type {String}
     */
    PATCH: 'UPDATE',
    /**
     *  Specifies a DELETE action to be performed on a resource.
     *  For example, an HTTP DELETE request or a database DELETE operation.
     *  @type {String}
     */
    DELETE: 'DELETE',
};

export default Action;
