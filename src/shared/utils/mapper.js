import axios from "axios";

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

const Mapper=async(input,mapper_file) =>{
    try {
      let authorization = process.env.BPP_AUTH;

    
      let request = {
        baseURL: process.env.EUNIMART_CORE_HOST,
        url: "/ipaas/boson_convertor",
        method: "POST",
        headers: {
          Authorization: authorization,
        },
        data:{
          data:{
            input_data:[input],
            mapper_template:mapper_file
          }
        }
      };
      let response = await axios(request);
      let apiResponse
      if (response?.data?.data?.error_message==null){
        apiResponse = response?.data?.data?.mapped_response[0]
      }
      else{
        console.log("input data : ",input)
        console.log("mapper error message",response?.data?.data?.error_message)
        console.log("mapper response",response?.data?.data?.mapped_response)
      }
      return apiResponse;
    } catch (err) {
      console.log("Error ========>>> ", err);
    }
  }

  export {Mapper}