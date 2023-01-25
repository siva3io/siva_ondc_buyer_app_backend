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

import Validator from 'jsonschema';
import { cancelContext, cancelMessage, cancel } from "./schemas/cancel.js";
import { confirmContext, confirmMessage, confirm, confirmPayment, confirmQuote, confirmPrice, confirmFulfillments, confirmEnd, confirmBilling, confirmItems, confirmProvider } from "./schemas/confirm.js";
import { initContext, initMessage, init, initProvider, initBilling, initItems, initEnd, initFulfillments } from "./schemas/init.js";
import { searchContext, searchByCategory, searchByItem, searchByCity, searchByCityMessage, searchByItemMessage, searchByCategoryMessage } from "./schemas/search.js";
import { selectContext, selectMessage, select } from "./schemas/select.js";
import { statusContext, statusMessage, status } from "./schemas/status.js";
import { supportContext, supportMessage, support } from "./schemas/support.js";
import { trackContext, trackMessage, track } from "./schemas/track.js";
import { updateContext, updateMessage, update } from "./schemas/update.js";
import { issueContext, issueMessage, issue } from './schemas/issue.js';
import { userChangePasswordSchema, userForgetPasswordSchema, userLoginSchema, userSignupSchema } from './schemas/user.js';

var v = new Validator.Validator();

class BAPValidator{


async validateCancel(data){
    v.addSchema(cancelContext, '/cancelContext');
    v.addSchema(cancelMessage, '/cancelMessage');
    var response  = await v.validate(data, cancel)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateConfirm(data){
    v.addSchema(confirmPayment, '/confirmPayment');
    v.addSchema(confirmQuote, '/confirmQuote');
    v.addSchema(confirmPrice, '/confirmPrice');
    v.addSchema(confirmFulfillments, '/confirmFulfillments');
    v.addSchema(confirmEnd, '/confirmEnd');
    v.addSchema(confirmBilling, '/confirmBilling');
    v.addSchema(confirmItems, '/confirmItems');
    v.addSchema(confirmProvider, '/confirmProvider');
    v.addSchema(confirmContext, '/confirmContext');
    v.addSchema(confirmMessage, '/confirmMessage');
    var response  = await v.validate(data, confirm)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateInit(data){
    v.addSchema(initProvider, '/initProvider');
    v.addSchema(initBilling, '/initBilling');
    v.addSchema(initItems, '/initItems');
    v.addSchema(initEnd, '/initEnd');
    v.addSchema(initFulfillments, '/initFulfillments');
    v.addSchema(initContext, '/initContext');
    v.addSchema(initMessage, '/initMessage');
    var response  = await v.validate(data, init)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateSearch(data, mode){
    let response = {}
    if (mode == "category"){
        v.addSchema(searchContext, '/searchContext');
        v.addSchema(searchByCategoryMessage, '/searchByCategoryMessage');
        response  = await v.validate(data, searchByCategory)
    }
    else if (mode == "item"){
        v.addSchema(searchContext, '/searchContext');
        v.addSchema(searchByItemMessage, '/searchByItemMessage');
        response  = await v.validate(data, searchByItem)
    }
    else if (mode == "city"){
        v.addSchema(searchContext, '/searchContext');
        v.addSchema(searchByCityMessage, '/searchByCityMessage');
        response  = await v.validate(data, searchByCity)
    }
    else{
        return false
    }
    
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateSelect(data){
    v.addSchema(selectContext, '/selectContext');
    v.addSchema(selectMessage, '/selectMessage');
    var response  = await v.validate(data, select)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateStatus(data){
    v.addSchema(statusContext, '/statusContext');
    v.addSchema(statusMessage, '/statusMessage');
    var response  = await v.validate(data, status)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateSupport(data){
    v.addSchema(supportContext, '/supportContext');
    v.addSchema(supportMessage, '/supportMessage');
    var response  = await v.validate(data, support)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateIssue(data){
    v.addSchema(issueContext, '/issueContext');
    v.addSchema(issueMessage, '/issueMessage');
    var response  = await v.validate(data, issue)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateTrack(data){
    v.addSchema(trackContext, '/trackContext');
    v.addSchema(trackMessage, '/trackMessage');
    var response  = await v.validate(data, track)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateUpdate(data){
    v.addSchema(updateContext, '/updateContext');
    v.addSchema(updateMessage, '/updateMessage');
    var response  = await v.validate(data, update)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

validateUserSignUp(data){
    var response = v.validate(data,userSignupSchema)
    if (response.errors.length==0){
        return true
    }
    return false
}

validateUserLogin(data){
    var response = v.validate(data,userLoginSchema)
    if (response.errors.length==0){
        return true
    }
    return false
}
validateUserForgetPassword(data){
    var response = v.validate(data,userForgetPasswordSchema)
    if (response.errors.length==0){
        return true
    }
    return false
}

validateUserChangePassword(data){
    var response = v.validate(data,userChangePasswordSchema)
    if (response.errors.length==0){
        return true
    }
    return false
}

}
export default BAPValidator;