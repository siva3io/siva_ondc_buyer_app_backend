<!--
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
-->
# Introduction
A node js rest api server which sits between ONDC protocol layer and react app in browser

# For whom
anyone who want to refer for building a UI friendly API on protocol layer

# Server side Events(SSE)
- Since each request response is async in ONDC, when we receive data from protocol layer we communicate it to browser as soon as possible with SSE
- Opens the connection at the time of first response from protocol layer that needs to be communicated to browser

# Build with nodejs
- using express js
- Implements referral implementation of payment integration with Juspay

# To run locally
```
yarn add or npm install
yarn debug or npm debug
```

# To build
```
yarn add or npm install
yarn start or npm start
```


