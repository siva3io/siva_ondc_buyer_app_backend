// const AWS = require('aws-sdk')
import AWS from 'aws-sdk'

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

var s3
export const awsConnect = () => {
    s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
        Bucket: process.env.AWS_S3_BUCKET_NAME
    });
}

const upload = async (file_name, data, account_id,channel_type,extension) => {
    var todays_date= new Date()
   let invoice_path = `${account_id}/ondc-deckn/${channel_type}/${todays_date.getFullYear()}/${todays_date.getMonth() + 1}/${todays_date.getDate()}/${file_name}.${extension}`
    let params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: invoice_path,
        Body: data  // Only accepts [ Buffer, string, stream data, stringify data ]
        // ContentType: 'text/plain'
    };
        return s3.upload(params).promise()
            .then((data) => {
                return data.Location
            })
            .catch(err => console.log(err))
}

export default upload