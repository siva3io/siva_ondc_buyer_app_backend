//@ts-check
import nodemailer from "nodemailer";

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


const sendEmail = (toEmail, subject, message) => {
    
  return new Promise((resolve, reject) => {
  
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.NO_REPLY_USERNAME,
        pass: process.env.NO_REPLY_PASSWORD,
      },
    });

    let emailDetails = {
      from: process.env.NO_REPLY_USERNAME,
      to: toEmail,
      subject: subject,
      text: message,
    //   html: "<p>666666 is your one-time passcode (OTP) for the McDonald’s app.</p>"
    };

    transporter.sendMail(emailDetails, function(err, data) {
      if (err) {
        console.log("Error " + err);
        reject(err);
      } else {
        resolve("email sent");
      }
    })

  });

}

export {sendEmail};