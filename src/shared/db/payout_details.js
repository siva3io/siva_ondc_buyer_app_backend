import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

const PayoutDetailsSchema = new mongoose.Schema(
    {
        orderCreatedDate: { type: Date },
        buyerAppOrderId: { type: String },
        networkOrderId: { type: String },
        sellerNetworkParticipant: { type: String },
        sellerName: { type: String },
        orderReturnPeriodExpiryDate: { type: String },
        settlementDueDate: { type: String },
        skuName: { type: String },
        orderQuantity: { type: Number },
        totalItemValueIncludingTax: { type: Number },
        shippingCharges: { type: Number },
        packagingCharges: { type: Number },
        convenienceCharges: { type: Number },
        totalOrderValue: { type: Number },
        buyerFinderFeeonTotalOrderValue: { type: Number },
        merchantPayableAmount: { type: Number },
        transaction: {type: Object},
        transactionStatus: {type: Object},
        paymentTransactionId: { type: String }  ,
        paymentStatus:{type:String,enum: ['created', 'attempted','paid']} // add enums (inprofress, created, failed)      
    },
    { _id: true, timestamps: true }
);

PayoutDetailsSchema.index({userId: 1, createdAt: -1});
PayoutDetailsSchema.plugin(mongoosePaginate)

const PayoutDetails = mongoose.model('payout_details', PayoutDetailsSchema, "payout_details");

export default PayoutDetails;
