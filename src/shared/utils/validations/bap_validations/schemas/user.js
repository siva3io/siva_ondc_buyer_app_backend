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

const userSignupSchema = {
    "id": "/user_signup_schema",
    "type":"object",
    "required": ["username", "password", "confirm_password"],
    "properties": {
        "username": {"type":"string"},
        "password": {"type":"string"},
        "confirm_password": {"type":"string"},
    }
};

const userLoginSchema={
    "id":"/user_login_schema",
    "type":"object",
    "required": ["username","password"],
    "properties": {
        "username": {"type":"string"},
        "password": {"type":"string"},
    }
};

const userForgetPasswordSchema={
    "id":"/user_login_schema",
    "type":"object",
    "required": ["username"],
    "properties": {
        "username": {"type":"string"},
        
    }
};

const userChangePasswordSchema={
    "id":"/user_login_schema",
    "type":"object",
    "required": ["username", "password", "confirm_password","otp"],
    "properties": {
        "username": {"type":"string"},
        "password": {"type":"string"},
        "confirm_password": {"type":"string"},
        "otp": {"type":"string"}
    }
    
};


export {userSignupSchema,userLoginSchema,userForgetPasswordSchema,userChangePasswordSchema}