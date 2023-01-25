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

const onSearchContext = {
    "id": "/onSearchContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "country": {"type": "string"},
        "city": {"type": "string"},
        "action": {"enum": [ "on_search" ]},
        "core_version": {"type": "string"},
        "bap_id": {"type": "string"},
        "bap_uri": {"type": "string"},
        "bpp_id": {"type": "string"},
        "bpp_uri": {"type": "string"},
        "transaction_id": {"type": "string"},
        "message_id": {"type": "string"},
        "timestamp": {"type": "string"},
      }
};

const onSearchDescriptor = {
    "id": "/onSearchDescriptor",
    "type": "object",
    "required": ["name", "symbol", "short_desc", "long_desc", "images"],
    "properties": {
        "name": {"type": "string"},
        "symbol": {"type": "string"},
        "short_desc": {"type": "string"},
        "long_desc": {"type": "string"},
        "images": {"type": "array"},
    }
}

const onSearchItems = {
    "id": "/onSearchItems",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "descriptor": {"$ref": "/onSearchDescriptor"},
        "quantity": {"type": "object"},
        "price": {"type": "object"},
        "category_id": {"type": "string"}, 
        "fulfillment_id": {"type": "string"},
        "location_id": {"type": "string"},
        "@ondc/org/returnable":{"enum": [ false, true ]},
        "@ondc/org/cancellable":{"enum": [ false, true ]},
        "@ondc/org/return_window": {"type": "string"},
        "@ondc/org/seller_pickup_return":{"enum": [ false, true ]},
        "@ondc/org/time_to_ship": {"type": "string"},
        "@ondc/org/available_on_cod":{"enum": [ false, true ]},
        "@ondc/org/contact_details_consumer_care": {"type": "string"},
        "@ondc/org/statutory_reqs_packaged_commodities": {"type": "object"},
        "@ondc/org/statutory_reqs_prepackaged_food": {"type": "object"},
        "@ondc/org/mandatory_reqs_veggies_fruits": {"type": "object"},
        "tags": {"type": "object"}
    }
}

const onSearchMessage = {
    "id": "/onSearchMessage",
    "type": "object",
    "required": ["catalog"],
    "additionalProperties": true,    
 
    "properties": {
        "catalog": {
            "type": "object",
            "required": ["bpp/fulfillments", "bpp/descriptor", "bpp/providers"],
            "properties": {
                "bpp/fulfillments":{
                    "type": "array",
                    "items":{
                        "id": {"type": "string"},
                        "type": {"type": "string"},
                    },
                "bpp/descriptor":{"$ref": "/onSearchDescriptor"},
                "bpp/providers":{
                    "type": "array",
                    "items":{
                        "id": {"type": "string"},
                        "descriptor": {"$ref": "/onSearchDescriptor"},
                        "@ondc/org/fssai_license_no": {"type": "string"},
                        "ttl": {"type": "string"},
                        "locations": {"type": "array"},
                        "items":{"$ref": "/onSearchItems"}
                        }
                    }
                }
            }
        }
    }
}
            
const onSearch = {
    "id": "/onSearch",
    "type": "object",
    "properties": {
        "context": {"$ref": "/onSearchContext"},
        "message": {"$ref": "/onSearchMessage"},
      }
};

export  {onSearchContext, onSearchMessage, onSearch, onSearchDescriptor, onSearchItems};