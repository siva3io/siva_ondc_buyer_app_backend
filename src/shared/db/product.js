import mongoose from "mongoose";
import {LocationSchema} from './provider.js'
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


const DescriptorSchema = new mongoose.Schema(
    {
        name: { type: String },
        symbol: { type: String },
        short_desc: { type: String },
        long_desc: { type: String },
        images: { type: [String] },    
    },
    { _id: false }
);

const QuantitySchema = new mongoose.Schema(
    {
        available: { type: Object },
        maximum: { type: Object },
    },
    { _id: false }
);

const PriceSchema = new mongoose.Schema(
    {
        currency: { type: String },
        value: { type: String },
        maximum_value: { type: String },  
    },
    { _id: false }
    );
    
    const TagsSchema = new mongoose.Schema(
    {
        product_type: { type: String },
        brand_name: { type: String },
        color: { type: String },
        gender: { type: String },
        size: { type: String },
        country_of_origin: { type: String },
    },
    { _id: false }
);


const AddressSchema = new mongoose.Schema(
    {
        full: { type: String}
    },
    { _id: false }
)


const ContactSchema = new mongoose.Schema(
    {
        name: { type: String},
        email: { type: String},
        phone: { type: String},
        address: {type: AddressSchema}
    },
    { _id: false }
)


const ManfacturerSchema = new mongoose.Schema(
    {
        address: { type: AddressSchema},
        contact: { type: ContactSchema},
        descriptor: { type: DescriptorSchema}
    },
    { _id: false, timestamps: true }
)


const ProductSchema = new mongoose.Schema(
    {
        id: { type: String },
        provider_id: { type: String},
        descriptor: { type: DescriptorSchema },
        quantity: { type: QuantitySchema },
        price: { type: PriceSchema },
        locations:{ type:[LocationSchema] },
        category_id: { type: String },
        fulfillment_id: { type: String },
        is_returnable: { type: String },
        is_cancellable: { type: String },
        return_window: { type: String },
        is_seller_pickup_return: { type: String },
        time_to_ship: { type: String },
        is_available_on_cod: { type: String },
        contact_details_consumer_care: { type: String },
        statutory_reqs_packaged_commodities: { type: Object },
        statutory_reqs_prepackaged_food: { type: Object },
        mandatory_reqs_veggies_fruits: { type: Object },
        tags: { type: TagsSchema },
        external_id: {type:String},
        manufacturer: { type: ManfacturerSchema},
        hsn_code_details : { type: Object },
        package_dimensions : { type: Object },
        created_by: {type : String},
        rating: {type: Number},
        rating_count: {type: Number},
        offer_details:{type:Object}

    },
    { _id: true, timestamps: true }
);

ProductSchema.index({userId: 1, createdAt: -1});
ProductSchema.plugin(mongoosePaginate)
const Product = mongoose.model('products', ProductSchema, "products");

export default Product;