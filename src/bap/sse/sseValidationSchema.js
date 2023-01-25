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

const ProductSchema = {
    type: 'array',
    items : {
    // required: ['id', 'descriptor', 'quantity', 'matched',
    //     'price', 'category_id','location_id', 'fulfillment_id',  'tags'],
    properties: {
        "id": { "type": "string" },
        "descriptor": {
            "type": 'object',
            // required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
            properties: {
                "name": { "type": 'string', },
                "symbol": { "type": 'string' },
                "short_desc": { "type": 'string' },
                "long_desc": { "type": 'string' },
                "images": {"anyOf": [
                    {"type": 'array'},
                    {"type": 'null'}
                  ]}
            }
        },
        "quantity": {
            "type": 'object',
            // required: ['available', 'maximum'],
            properties: {
                "available": {
                    "type": 'object'
                },
                "maximum": {
                    "type": 'object'
                }

            }
        },
        "price": {
            "type": 'object',
            // required: ['currency', 'value', 'maximum_value'],
            properties: {
                "currency": { "type": 'string' },
                "value": { "type": 'string' },
                "maximum_value": { "type": 'string' }
            }
        },
        "matched":{ "type": "boolean" },
        "location_id":{ "type": "string" },
        "parent_category_id":{ "type": "string" },
        "location_id": { "type": "string" },
        "category_id": { "type": "string" },
        "fulfillment_id": { "type": "string" },
        //"@ondc/org/returnable": { "type": 'string' },
        //"@ondc/org/cancellable": { "type": 'string' },
        //"@ondc/org/return_window": { "type": "string" },
        //"@ondc/org/seller_pickup_return": { "type": 'string' },
        "time_to_ship": { "type": "string" },
        //"@ondc/org/available_on_cod": { "type": 'string' },
        "@ondc/org/contact_details_consumer_care": { "type": "string" },
        "statutory_reqs_packaged_commodities": { "type": "object" },
        "statutory_reqs_prepackaged_food": { "type": "object" },
        "mandatory_reqs_veggies_fruits": { "type": "object" },
        "tags": {
            "type": 'object',
            // required: ['product_type', 'brand_name', 'color', 'gender', 'size', 'country_of_origin'],
            properties: {
                "product_type": { "type": "string" },
                "brand_name": { "type": "string" },
                "color": { "type": "string" },
                "gender": { "type": "string" },
                "size": { "type": "string" },
                "country_of_origin": { "type": "string" }
            }
        }
    },
    "if": {
        "properties": {
          "@ondc/org/returnable": { "const": true }
        },
        "required": ["@ondc/org/returnable"]
      },
      "then": { "required": ["@ondc/org/return_window"] },
      "if": {
        "properties": {
          "category_id": { "const": "Fruits and Vegetables" }
        },
        "required": ["category_id"]
      },
      "then": { "required": ["@ondc/org/mandatory_reqs_veggies_fruits"] }

}
}

export const ProviderValidationSchema = {
    type: 'array',
    items : {
    // required: ['id', 'descriptor', '@ondc/org/fssai_license_no','items'],
    properties: {
        "id": { "type": "string" },
        "descriptor": {
            "type": 'object',
            // required: ['name', 'symbol', 'short_desc', 'long_desc', 'images'],
            properties: {
                "name": { "type": 'string', },
                "symbol": { "type": 'string' },
                "short_desc": { "type": 'string' },
                "long_desc": { "type": 'string' },
                "images": { "type": 'array' }
            }
        },
        "@ondc/org/fssai_license_no":{ "type": "string" },
        "items": ProductSchema
    }
}
}




