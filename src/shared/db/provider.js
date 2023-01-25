//@ts-check
import mongoose from "mongoose";

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

const FulfillmentSchema = new mongoose.Schema(
    {
        id: { type: String },
        type: { type: String },    
    },
    { _id: false }
);

const DescriptorSchema = new mongoose.Schema(
    {
        name: { type: String },
        symbol: { type: String },
        short_desc: { type: String },
        long_desc: { type: String },
        images: { type: [String] },   
        external_id: {type: String}, 
        fulfillments: { type: [FulfillmentSchema]},
    },
    { _id: false }
);

const CircleSchema = new mongoose.Schema(
    {
        gps: { type: String },
        radius: { type: Object },    
    },
    { _id: false }
);

const TimeSchema = new mongoose.Schema(
    {
        days: { type: String },
        schedule: { type: Object },
        range: { type: Object },    
    },
    { _id: false }
);

const LocationSchema = new mongoose.Schema(
    {
        id: { type: String },
        gps: { type: String },
        address: { type: Object },
        circle: { type: CircleSchema },
        time: {type: TimeSchema},
        contact : { type: Object}   
    },
    { _id: false }
);

const ProviderSchema = new mongoose.Schema(
    {
        id: { type: String },
        descriptor: { type: DescriptorSchema },
        ttl: { type: String },
        locations: { type: [LocationSchema] },
        company_id : {type : Number},
        company_details :{type : Object}
    },
    { _id: true, timestamps: true }
);

ProviderSchema.index({userId: 1, createdAt: -1});

const Provider = mongoose.model('provider', ProviderSchema, "provider");

export default Provider;
export  {
    LocationSchema
}