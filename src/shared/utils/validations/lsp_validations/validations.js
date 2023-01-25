import Validator from 'jsonschema';
import {searchContext, searchMessage, searchValidation} from "./schemas/search.js"
import {initContext, initMessage, initValidation} from "./schemas/init.js"
import {confirmContext, confirmMessage, confirmValidation} from "./schemas/confirm.js"
import {updateContext, updateMessage, updateValidation} from "./schemas/update.js"

import { statusContext, statusMessage, statusValidation } from "./schemas/status.js";
import { cancelContext, cancelMessage, cancelValidation } from "./schemas/cancel.js";
import { trackContext, trackMessage, trackValidation } from "./schemas/track.js";
import { supportContext, supportMessage, supportValidation } from "./schemas/support.js";
import { commandOptions } from 'redis';

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

var v = new Validator.Validator();

class LSPValidator { 

    async validateSearch(data){
        v.addSchema(searchContext, '/searchContext');
        v.addSchema(searchMessage, '/searchMessage');
        
        var response = await v.validate(data, searchValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }
    async validateInit(data){
        v.addSchema(initContext, '/initContext');
        v.addSchema(initMessage, '/initMessage');
        
        var response = await v.validate(data, initValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }
    async validateConfirm(data){
        v.addSchema(confirmContext, '/confirmContext');
        v.addSchema(confirmMessage, '/confirmMessage');
        
        var response = await v.validate(data, confirmValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }

    async validateUpdate(data){
        v.addSchema(updateContext, '/updateContext');
        v.addSchema(updateMessage, '/updateMessage');
        
        var response = await v.validate(data, updateValidation)
        if (response["errors"].length == 0){
            return true
        }
        // console.log(response["errors"])
        return false
    }
    async validateStatus(data){
        v.addSchema(statusContext, '/statusContext');
        v.addSchema(statusMessage, '/statusMessage');
        var response  = await v.validate(data, statusValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }

    async validateCancel(data){
        v.addSchema(cancelContext, '/cancelContext');
        v.addSchema(cancelMessage, '/cancelMessage');
        var response  = await v.validate(data, cancelValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }
    async validateTrack(data){
        v.addSchema(trackContext, '/trackContext');
        v.addSchema(trackMessage, '/trackMessage');
        var response  = await v.validate(data, trackValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }
    async validateSupport(data){
        v.addSchema(supportContext, '/supportContext');
        v.addSchema(supportMessage, '/supportMessage');
        var response  = await v.validate(data, supportValidation)
        if (response["errors"].length == 0){
            return true
        }
        return false
    }
}


export default LSPValidator