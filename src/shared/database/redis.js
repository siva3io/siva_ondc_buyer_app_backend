import { createClient } from 'redis';

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

let redisClient;

const redisConnect = async () => {

    let url = `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`

    redisClient = createClient({ url });

    redisClient.on("error", (error) => console.error(`Redis Error : ${error}`));

    await redisClient.connect();
};

const redisSubscribe = async (key) => {
    let message
    message = redisClient.get(key)
    
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        message = await redisClient.get(key)
        // console.log("message for key", key, "not found");
        if (message != null) {    
            await redisClient.del(key)
            return JSON.parse(message)
        }
    }
    
    return {
        message: {
            "ack": { "status": "NACK" },
            "error": { "type": "Event", "code": "10000", "message": "event timeout" }
        }
    }
}


export {
    redisConnect,
    redisClient,
    redisSubscribe
}