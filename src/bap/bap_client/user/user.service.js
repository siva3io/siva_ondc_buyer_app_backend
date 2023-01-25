//@ts-check
import { createUser, getUser,updateUser } from "../../../shared/db/dbService.js";
import generateJWT from "../../../shared/utils/jwt.js";
import { v4 as uuidv4 } from 'uuid';
import BAPValidator  from "../../../shared/utils/validations/bap_validations/validations.js";
import { generateOtp, verifyOtp } from "../../../shared/utils/otp_generator.js";
import { sendEmail } from "../../../shared/utils/email_sender.js";
import { Hash, VerifyHash } from "../../../shared/utils/hasher.js";

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

class UserService{

  async createUser(userRequest) {
  try{
 
  var validation_flag =new BAPValidator().validateUserSignUp(userRequest)


  if (!validation_flag) {
    return {
            message: {
                "message": "enter valid data" }
            }
        }
  if (userRequest.password!==userRequest.confirm_password){
    return {
      "message": "password mismatch"
    }
  }

  let hashedPassword = await Hash(userRequest.password);

  let userPayload = {
    'id': uuidv4(),
    'username': userRequest.username,
    'password': hashedPassword,
    'usertype': userRequest.usertype

  } 
   let user= await createUser(userPayload) ;
   return  {
    "message":"You have successfully signed in!!",
    "token": generateJWT({'username': userRequest.username, 'ID': user._id}),
    "userid": userPayload.id,
    "usertype": user.usertype

  };
  }catch(error){
    console.error(error)
    throw error;
  }
    
  }

  async validateUser(userRequest) {
    try{

      var validation_flag =new BAPValidator().validateUserLogin(userRequest)
      if (!validation_flag) {
        return {
                message: {
                    "message": "enter valid data" }
                }
         }

      let query = {
          username : userRequest.username
      } 
      
      let user = await getUser(query);

      if (user === null) {
        return {"message":"incorrect username or password"}
      };

      let passwordVerified = await VerifyHash(userRequest.password, user.password)

      if  (!passwordVerified) {
        return {"message":"incorrect username or password"}
      }

      return  {
          "message":"You have successfully logged in!!",
          "token": generateJWT({'username': userRequest.username, 'ID': user._id}),
          "userid": user.id
        };      
    }catch(error){
        console.error(error)
        throw error;
    }
  }

  async forgotPassword(userRequest) {
    try{
      var validation_flag =new BAPValidator().validateUserForgetPassword(userRequest)

      if (!validation_flag) {
        return {
                message: {
                    "message": "enter valid data" }
                }
            }
        let query = {
          username : userRequest.username,
        } 
        let user = await getUser(query);
        if (user === null) {
          return { "message" : "user not found" }
        };

        let otp = generateOtp()

        console.log(userRequest.username);

        await sendEmail(userRequest.username, 'Your One-Time Passcode from Eunimart', otp + ' is your one-time passcode (OTP) for the eunimart app.')
        
        await updateUser(query, {otp});

        return  { "message" : "otp sent successfully" }
    }catch(error){
        console.error(error)
        throw error;
    }
  }

   async changePassword(userRequest){
      try{
        var validation_flag =new BAPValidator().validateUserChangePassword(userRequest)


        if (!validation_flag) {
          return {
                  message: {
                      "message": "enter valid data" }
                  }
              }
        if (userRequest.password!==userRequest.confirm_password){
          return {
              "message": "password mismatch"
          }
        }

        if (!verifyOtp(userRequest.otp)) {
          return { "message": "invalid otp" }
        }

        let query ={
          username : userRequest.username
        }

        let user = await getUser(query);

        if (user === null) {
          return { "message" : "user not found" }
        };

        if (user.otp != userRequest.otp) {
          return { "message": "invalid otp" }
        }

        let hashedPassword = await Hash(userRequest.password);

        let data={
          password : hashedPassword,
          otp : null
        }
        await updateUser(query,data);

        return  {
          "message":"Updated successfully !!",
        }      
       }catch(error){
         console.error(error)
         throw error;
       }
     }

      
}

export default UserService