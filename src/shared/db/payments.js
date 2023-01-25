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

const PaymentSchema = new mongoose.Schema(
    {
        id: { type: String },
        seller_id:{type: String,default:"SIVA-ONDC-STORE-1"},
        seller_name:{type: String,default:"Siva Store"},
        orderId: { type: String },
        invoiceId: { type: String },
        orderNumber: { type: String },
        orderDate: { type: Date },
        paymentStatus: { type: String },
        paidDate: { type: Date },
        orderStatus: { type: String },
        cartDiscount: { type: Number },
        orderCurrency: { type: String },
        paymentMethod: { type: String },
        txnDate: { type: Date },
        skuId: { type: String },
        lineItemAmount: { type: Number },
        itemSkuCount: { type: Number },
        orderType: { type: String },
        declaredPrice: { type: Number },
        ondcCommissionFee: { type: Number },
        ondcTax: { type: Number },
        ondcTotalAmount: { type: Number },
        buyerAppFee: { type: Number },
        buyerAppTax: { type: Number },
        buyerAppTotalAmount: { type: Number },
        sellerAppFee: { type: Number },
        sellerAppTax: { type: Number },
        sellerAppTotalAmount: { type: Number },
        paymentGatewayFee: { type: Number },
        paymentGatewayTax: { type: Number },
        paymentGatewayTotalAmount: { type: Number },
        gatewayFee: { type: Number },
        gatewayTax: { type: Number },
        gatewayTotal: { type: Number },
        shippingFee: { type: Number },
        shippingFeeTax: { type: Number },
        shippingTotal: { type: Number },
        orderTotal: { type: Number },
        taxGstTotal: { type: Number },
        withHoldingTaxBuyerApp: { type: Number },
        withHoldingTaxSellerApp: { type: Number },
        tdsByBuyerApp: { type: Number },
        tdsBySellerApp: { type: Number },
        tdsByOndc: { type: Number },
        tdsByGateway: { type: Number },
        createdBy: { type: String},
        createdAt: { type: Date, default: new Date()}
    },
    { _id: true, timestamps: true }
);

PaymentSchema.index({userId: 1, createdAt: -1});
PaymentSchema.plugin(mongoosePaginate)

const Payment = mongoose.model('payment', PaymentSchema, "payment");

export default Payment;
