import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

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

const LspProviderLocationSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
    },
    { _id: false }
);
const LspProviderSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        locations: {type: [LspProviderLocationSchema]},
    },
    { _id: false }
);

const LspScalarRangeSchema = new mongoose.Schema(
    {
        min: { type: mongoose.Decimal128 },
        max: { type: mongoose.Decimal128 },
    },
    { _id: false }
);
const LspScalarSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ['CONSTANT', 'VARIABLE'] },
        value: { type: mongoose.Decimal128, required: true },
        estimatedValue: { type: mongoose.Decimal128 },
        computedValue: { type: mongoose.Decimal128 },
        range: { type: LspScalarRangeSchema },
        unit: { type: String, required: true },
    },
    { _id: false }
);

const LspItemQuantityAllocatedSchema = new mongoose.Schema(
    {
        count: { type: Number },
        measure: { type: LspScalarSchema },
    },
    { _id: false }
);
const LspOrderItemSchema = new mongoose.Schema(
    {
        id :{ type: String},
        category_id : { type: String},
        quantity : {type :LspItemQuantityAllocatedSchema},
    },
    { _id: false }
);
const LspAddOnsSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
    },
    { _id: false }
);
const LspOfferSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
    },
    { _id: false }
);
const LspDocumentsSchema = new mongoose.Schema(
    {
        url : { type: String},
        label : { type: String},
    },
    { _id: false }
);
const LspOrganizationSchema = new mongoose.Schema(
    {
        name: { type: String },
        cred: { type: String },
    },
    { _id: false }
);
const LspAddressSchema = new mongoose.Schema(
    {
        door: { type: String },
        name: { type: String },
        building: { type: String },
        street: { type: String },
        locality: { type: String },
        ward: { type: String },
        city: { type: String },
        state: { type: String },
        country: { type: String },
        area_code: { type: String }
    },
    { _id: false }
);
const TimeRangeSchema = new mongoose.Schema(
    {
        start: { type: Date },
        end: { type: Date },
    },
    { _id: false }
);
const LspSchedulerSchema = new mongoose.Schema(
    {
        frequency : { type: String },
        holidays :{type : [Date]},
        times: { type:[Date]},
    }
);
const TimeSchema = new mongoose.Schema(
    {
        label: { type: String },
        timestamp: { type: Date },
        duration: { type: String },
        range: { type: TimeRangeSchema },
        days: { type: String },
        schedule :{ type: LspSchedulerSchema },

    },
    { _id: false }
);
const LspBillingSchema = new mongoose.Schema(
    {
        id: { type: String},
        name: { type: String, required: true },
        organization: { type: LspOrganizationSchema },
        address: { type: LspAddressSchema },
        email: { type: String },
        phone: { type: String, required: true },
        time: { type: TimeSchema },
        tax_number: { type: String },
    },
    { _id: false, timestamps: true }
);
const LspDescriptorSchema = new mongoose.Schema(
    {
        name: {type: String},
        code: { type: String },
        symbol: { type: String },
        short_desc: { type: String },
        long_desc: { type: String },
        phone: { type: String },
        images: { type: [String] },
        audio: { type: String },
        "3d_render": { type: String }
    },
    { _id: false }
);
const LspStateSchema = new mongoose.Schema(
    {
        descriptor: { type: LspDescriptorSchema },
        updated_at: { type: Date },
        updated_by: { type: String },
    },
    { _id: false }
);
const LspPersonSchema = new mongoose.Schema(
    {
        name: { type: String },
        image: { type: String },
        dob: { type: Date },
        gender: { type: String },
        cred: { type: String },
        tags: { type: Map },
    },
    { _id: false }
);
const LspContactSchema = new mongoose.Schema(
    {
        phone: { type: String },
        email: { type: String },
        tags: { type: Map }
    },
    { _id: false }
);
const LspCustomerSchema = new mongoose.Schema(
    {
        person: { type: LspPersonSchema },
        contact: { type: LspContactSchema }
    },
    { _id: false }
);
const LspAgentSchema = new mongoose.Schema(
    {
        name: { type: String },
        image: { type: String },
        dob: { type: Date },
        gender: { type: String },
        cred: { type: String },
        tags: { type: Map },
        phone : { type: String},
        email : { type: String },
        rateable : { type: Boolean },
    },
    { _id: false }
);
const LspVehicleSchema = new mongoose.Schema(
    {
        category: { type: String },
        capacity: { type: Number },
        make: { type: String },
        model: { type: String },
        size: { type: String },
        variant: { type: String },
        color: { type: String },
        energy_Type: { type: String },
        registration: { type: String }
    },
    { _id: false }
);
const LspCitySchema = new mongoose.Schema(
    {
        name: { type: String },
        code: { type: String }
    },
    { _id: false }
);
const LspCountrySchema = new mongoose.Schema(
    {
        name: { type: String },
        code: { type: String }
    },
    { _id: false }
);
const LspCircleSchema = new mongoose.Schema(
    {
        gps : { type: String },
        radius: { type: LspScalarSchema },
    },
    { _id: false }
);
const LspLocationSchema = new mongoose.Schema(
    {
        id: { type: String },
        descriptor: { type: LspDescriptorSchema },
        gps: { type: String },
        address: { type: LspAddressSchema },
        stationCode: { type: String },
        city: { type: LspCitySchema },
        country: { type: LspCountrySchema },
        circle: { type: LspCircleSchema },
        polygon: { type: String },
        "3dspace": { type: String },
        time : { type: TimeSchema },
    },
    { _id: false }
);
const LspAuthorizationSchema = new mongoose.Schema(
    {
        type : { type: String},
        token : { type: String },
        valid_from : { type: Date },
        valid_to : { type: Date },
        status : { type: String },
    }
);
const LspFulfillmentStartorEndSchema = new mongoose.Schema(
    {
        location: { type: LspLocationSchema },
        time: { type: TimeSchema },
        instructions: { type: LspDescriptorSchema },
        contact: { type: LspContactSchema },
        person : { type: LspPersonSchema },
        authorization : { type: LspAuthorizationSchema},
    },
    { _id: false }
);
const LspFulfillmentSchema = new mongoose.Schema(
    {
        id: { type: String },
        type: { type: String },
        "@ondc/org/awb_no" : { type: String},
        "@ondc/org/ewaybillno":{ type: String},
        "@ondc/org/ebexpirydate": { type: String},
        provider_id : { type: String },
        rating : { type: Number, enum:[1,2,3,4,5] },
        state: { type: LspStateSchema },
        tracking: { type: Boolean },
        customer: { type: LspCustomerSchema },
        agent: { type: LspAgentSchema },
        person : { type: LspPersonSchema },
        contact : { type: LspContactSchema},
        vehicle: { type: LspVehicleSchema },
        start: { type: LspFulfillmentStartorEndSchema },
        end: { type: LspFulfillmentStartorEndSchema },
        retable: { type: Boolean },
        tags: { type: Map },
    },
    { _id: false }
);
const LspPriceSchema = new mongoose.Schema(
    {
        currency: { type: String },
        value: { type: String },
        estimated_value: { type: String },
        computed_value: { type: String },
        listed_value: { type: String },
        offered_value: { type: String },
        minimum_value: { type: String },
        maximum_value: { type: String },
    },
    { _id: false }
);

const LspQuotationBreakupSchema = new mongoose.Schema(
    {
        "@ondc/org/item_id" : { type: String },
        "@ondc/org/title_type": { type: String},
        title : { type: String },
        price: { type: LspPriceSchema }
    },
    { _id: false }
);

const LspQuotationSchema = new mongoose.Schema(
    {
        price: { type: LspPriceSchema },
        breakup: { type: [LspQuotationBreakupSchema] },
        ttl: { type: String }
    },
    { _id: false }
);
const LspCodSettlementDetailsSchema = new mongoose.Schema(
    {
        settlement_counterparty : { type: String },
        settlement_type : { type: String },
        settlement_bank_account_no: { type : String },
        settlement_ifsc_code: { type: String},
        upi_address: { type: String},
        settlement_status: { type: String},
        settlement_reference: { type: String},
        settlement_timestamp : { type: Date },
    },
    { _id: false }
);
const LspPaymentSchema = new mongoose.Schema(
    {
        uri: { type: String },
        tl_method: { type: String, enum: ['http/get', 'http/post'] },
        params: { type: Map },
        type: { type: String, enum: ['ON-ORDER', 'PRE-FULFILLMENT', 'ON-FULFILLMENT', 'POST-FULFILLMENT'] },
        status: { type: String, enum: ['PAID', 'NOT-PAID'] },
        time: { type: TimeSchema },
        collected_by: { type: String },
        "@ondc/org/collection_amount" : { type: String},
        "@ondc/org/settlement_window" : { type: String},
        "@ondc/org/settlement_window_status" : { type: String},
        "@ondc/org/settlement_details" : { type: [LspCodSettlementDetailsSchema]},
    },
    { _id: false }
);
const LspPolicySchema = new mongoose.Schema(
    {
        id : { type: String},
        descriptor : { type: LspDescriptorSchema},
        parent_policy_id : { type: String},
        time : { type: TimeSchema},
    },
    { _id: false }
);
const LspReasonSchema = new mongoose.Schema(
    {
        id : { type: String},
        descriptor : { type: LspDescriptorSchema},
    },
    { _id: false }
);
const LspSelectedReasonSchema = new mongoose.Schema(
    {
        id : { type: String},
    },
    { _id: false }
);
const LspOndcOrgCancellationSchema = new mongoose.Schema(
    {
        type : { type: String},
        ref_id : { type: String},
        policies : { type: [LspPolicySchema]},
        time : { type : Date},
        cancelled_by : { type: String},
        reasons : {type: LspReasonSchema},
        selected_reason : { type: LspSelectedReasonSchema},
        additional_description :{type : LspDescriptorSchema}
    },
    { _id: false }
);
const LspLinkedOrderItemSchema = new mongoose.Schema(
    {
        category_id : { type: String},
        name : { type: String},
        quantity : { type : LspItemQuantityAllocatedSchema},
        price : { type: LspPriceSchema},
    },
    { _id: false }
);
const LspLinkedOrderProviderSchema = new mongoose.Schema(
    {
        id : { type: String},
        name : { type: String},
        address : { type: LspAddressSchema}
    },
    { _id: false }
);
const LspOndcLinkedOrderSchemaOrderSchema = new mongoose.Schema(
    {
        id : { type: String},
        weight : { type: LspScalarSchema},
        dimensions :{
            length : { type: LspScalarSchema},
            breadth : { type: LspScalarSchema },
            height : { type: LspScalarSchema },
        },
        declared_value : { type : LspPriceSchema},
        taxable_value : { type: LspPriceSchema },
        hsn_code : { type: String},
        sgst_amount : {type : String},
        cgst_amount : { type: String},
        igst_amount : { type: String},
    },
    { _id: false}
);
const LspOndcLinkedOrderSchema = new mongoose.Schema(
    {
        items : { type : [LspLinkedOrderItemSchema] },
        provider : { type: LspLinkedOrderProviderSchema},
        order : { type: LspOndcLinkedOrderSchemaOrderSchema}, 
    },
    { _id: false }
);
const ContextSchema = new mongoose.Schema(
    {
        bap_id: { type: String ,default:"ondc.eunimart.com"},
        bpp_id: { type: String ,default:"ondc.eunimart.com"},
        bpp_uri : { type: String},
        bap_uri : { type: String},
        transaction_id: { type: String },
    },
    { _id: false }
);
const LspOrderSchema = new mongoose.Schema(
    {
        context : {type : ContextSchema},
        id :{ type: String, default: () => uuidv4()}, // lsp_order_id
        parent_context : {type : ContextSchema},
        state : { type: String, default:"Draft"}, //[Draft, Created, Accepted, In-progress, Completed, Cancelled]
        provider : {type : LspProviderSchema},
        items:{type:[LspOrderItemSchema]},
        add_ons : { type : [LspAddOnsSchema]},
        offers : { type : [LspOfferSchema]},
        documents :{type : [LspDocumentsSchema]},
        billing: { type: LspBillingSchema },
        fulfillments: { type: [LspFulfillmentSchema]},
        quote: { type: LspQuotationSchema },
        payment: { type: LspPaymentSchema },
        "@ondc/org/created_by": {type : String},
        "@ondc/org/cancellation": { type: LspOndcOrgCancellationSchema},
        "@ondc/org/linked_order":{type : LspOndcLinkedOrderSchema},
        created_by: { type: String },
    },
    { _id: true, timestamps: true }
);

LspOrderSchema.index({ userId: 1, createdAt: -1 });

const LspOrder = mongoose.model('lsp_order', LspOrderSchema, "lsp_order");

export default LspOrder;