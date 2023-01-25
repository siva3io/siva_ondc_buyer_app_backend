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

// import axios from 'axios';
// import cron from'node-cron';
// import {getPaymentByStatus,updatePayoutByPaymentStatusId,UpdateOrderWithTransactionId} from '../db/dbService.js'

// async function orderStatus(){
// const username=process.env.RAZOR_PAY_KEY_ID
// const password = process.env.RAZOR_PAY_KEY_SECRET
// const token = Buffer.from(`${username}:${password}`, 'utf8').toString('base64')
// await getPaymentByStatus("created").then((v)=>{
//         v.map((i)=>{
//             const url = process.env.RAZOR_PAY_URI+'/orders/'+i.transaction.id  // take URI from .env 
//             axios.get(url, {
//                 headers: {
//                   'Authorization': `Basic ${token}`
//                 },
//               }).then((response)=>{
//                 updatePayoutByPaymentStatusId(i._id,response.data.status)
//                 if(response.data.status==="paid"){
//                     UpdateOrderWithTransactionId(v.networkOrderId,"PAID")
//                 }else{
//                     UpdateOrderWithTransactionId(v.networkOrderId,"NOT-PAID")
//                 }
//               })
//             })
// }).catch((error)=>{
// })
// }
// //schedule for 10 seconds "*/10 * * * * *" 
// //schedule for 30 minutets "00 */30 * * * *" 
// const scheduler=()=>{cron.schedule('00 */30 * * * *', function() {
// orderStatus()
// });
// }


// export default scheduler;