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

const ERRORS = {
    UNAUTHENTICATED_ERROR: {
        status: 401,
        name: 'UNAUTHENTICATED_ERROR',
        message: 'Unauthenticated'
    },
    UNAUTHORISED_ERROR: {
        status: 403,
        name: 'UNAUTHORISED_ERROR',
        message: 'Permission denied'
    },
    NO_RECORD_FOUND_ERROR: {
        status: 404,
        name: 'NO_RECORD_FOUND_ERROR',
        message: 'Record not found'
    },
    DUPLICATE_RECORD_FOUND_ERROR: {
        status: 400,
        name: 'DUPLICATE_RECORD_FOUND_ERROR',
        message: 'Duplicate record found'
    },
    BAD_REQUEST_PARAMETER_ERROR: {
        status: 400,
        name: 'BAD_REQUEST_PARAMETER_ERROR',
        message: 'Bad request parameter'
    },
    CONFLICT_ERROR: {
        status: 409,
        name: 'CONFLICT_ERROR',
        message: 'Conflict error'
    },
    PRECONDITION_REQUIRED_ERROR: {
        status: 428,
        name: 'PRECONDITION_REQUIRED_ERROR',
        message: 'Precondition required'
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        name: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error occurred'
    }
}

export default ERRORS;