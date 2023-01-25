
import _ from 'lodash';
import {UnauthorisedError} from "../errors/index.js";

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

class Authorisation {
    /**
     * @param {*} user  Current logged in user object
     * @param {*} httpRequestMethod   HTTP request method e.g GET/POST/PUT/DELETE
     * @param {*} resource  Requested resource e.g user, case etc.
     */
    constructor(user, httpRequestMethod, resource,roles) 
    {
        this.user = user;
        // this.httpRequestMethod = httpRequestMethod;
        // this.resource = resource;
        this.roles = roles;
    }

    /**
     * Method to check if user has access to given protected resource
     */
//     async isAllowed() 
//     {
//         try 
//         {
//             //TODO: take from http request

// //                   let templatePermission = {};
// //
// //                   templatePermission = await userService.getPrivileges(this.user.id, this.user.id);
// //
// //                    if(templatePermission.permission.indexOf(this.resource) == -1){
// //                        reject(new UnauthorisedError());
// //                    }else{
// //                        resolve();
// //                    }

//             this.user.Roles.forEach(obj => {

//                 if (this.roles.includes(obj.name)) {
//                     resolve(this.user);
//                 }
//             });

//             reject(new UnauthorisedError());
//         } 
//         catch (err) 
//         {
//             console.error(err);
//             throw err
//         }
      
//     }

    isAllowed() 
    {
        return new Promise(async (resolve, reject) => {
            try 
            {

    //              // if user has a provided role
                this.user.Roles.forEach(obj => {

                    if (this.roles.includes(obj.name)) {
                        resolve(this.user);
                    }
                });

                reject(new UnauthorisedError());
            } catch (err) {
                console.error(err);
                reject(err);
            }
        });
    
    }

}

export default Authorisation;
