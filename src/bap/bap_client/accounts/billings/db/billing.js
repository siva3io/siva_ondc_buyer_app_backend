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

const OrganizationSchema = new mongoose.Schema(
    {
        name: { type: String, default: null },
        cred: { type: String, default: null },
    },
    { _id: false }
);

const AddressSchema = new mongoose.Schema(
    {
        door: { type: String, default: null },
        name: { type: String, default: null },
        building: { type: String, default: null },
        street: { type: String, default: null },
        locality: { type: String, default: null },
        ward: { type: String, default: null },
        city: { type: String, default: null },
        state: { type: String, default: null },
        country: { type: String, default: null },
        areaCode: { type: String, default: null }
    },
    { _id: false }
);

const TimeRangeSchema = new mongoose.Schema(
    {
        start: { type: Date, default: null },
        end: { type: Date, default: null },
    },
    { _id: false }
);

const TimeSchema = new mongoose.Schema(
    {
        label: { type: String, default: null },
        timestamp: { type: Date, default: null },
        duration: { type: String, default: null },
        range: { type: TimeRangeSchema, default: null },
        days: { type: String, default: null },
    },
    { _id: false }
);

const BillingSchema = new mongoose.Schema(
    {
        id: String,
        name: { type: String, required: true },
        phone: { type: String, required: true },
        organization: { type: OrganizationSchema, default: null },
        address: { type: AddressSchema, default: null },
        email: { type: String, default: null },
        time: { type: TimeSchema, default: null },
        taxNumber: { type: String, default: null },
        locationId: { type: String, default: null },
        userId: String
    },
    { _id: true, timestamps: true }
);

const Billing = mongoose.model('billing', BillingSchema, "billing");

export default Billing;