import winston from 'winston';

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

const { combine, timestamp, colorize, align, printf } = winston.format;

const logger = winston.createLogger({
    format: combine(
        colorize(),
        timestamp(),
        align(),
        printf((info) => {
            const { timestamp, level, message } = info;

            return `[${level}]:[${timestamp}] ---> ${message}`;
        })
    ),
    transports: [new winston.transports.Console({ colorize: true })],
});

// do not exit logger when uncaught exception occures
logger.exitOnError = false;

// write all the logs to the file in production environment only
// if (process.env.NODE_ENV === 'production') {
//     logger.add(
//         new winston.transports.File({ filename: __dirname + '/actions.log' })
//     );
// }

module.exports = logger;
