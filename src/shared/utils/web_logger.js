import { Server } from 'socket.io'
import Convert from 'ansi-to-html';

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

var convert = new Convert();

// var myLogFileStream = fs.createWriteStream('app.log');

const WebLogger = (server) => {

    const io = new Server(server);

    io.on('connection', function (socket) {

        var fn = process.stdout.write;

        function write() {
            fn.apply(process.stdout, arguments);
            emmitter.apply(emmitter, arguments)
            // myLogFileStream.write.apply(myLogFileStream, arguments);
        }

        var errFn = process.stderr.write
        function error() {
            errFn.apply(process.stderr, arguments);
            emmitter.apply(emmitter, arguments)
            // myLogFileStream.write.apply(myLogFileStream, arguments);
        }


        process.stdout.write = write;
        process.stderr.write = error;

        function emmitter(data) {
            data = convert.toHtml(data)

            let date = new Date().toJSON();

            data = '<b>' + date + '</b> : ' + data

            socket.emit('message', data);
        }

    });
}

export default WebLogger;