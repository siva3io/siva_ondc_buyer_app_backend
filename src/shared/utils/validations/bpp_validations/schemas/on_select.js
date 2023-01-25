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

const onSelectContext = {
    "id": "/onSelectContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "country": {"type": "string"},
        "city": {"type": "string"},
        "action": {"enum": [ "on_select" ]},
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
  
const onSelectBppFulfillments = {
    "id": "/onSelectBppFulfillments",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "type": {"type": "string"},
    }
};

const onSelectBppDescriptor = {
    "id": "/onSelectBppDescriptor",
    "type": "object",
    "required": ["name", "symbol", "short_desc", "long_desc", "images"],
    "properties": {
        "name": {"type": "string"},
        "symbol": {"type": "string"},
        "short_desc": {"type": "string"},
        "long_desc": {"type": "string"},
        "images": {"type": "array"},
    }
};

const onSelectItems = {
    "id": "/onSelectItems",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "descriptor": {"$ref": "/onSelectDescriptor"},
        "quantity": {"type": "object"},
        "price": {"type": "object"},
        "category_id": {"type": "string"}, 
        "fulfillment_id": {"type": "string"},
        "location_id": {"type": "string"},
        "@ondc/org/returnable":{"enum": [ false, true ]},
        "@ondc/org/cancellable":{"enum": [ false, true ]},
        // "@ondc/org/return_window": {"type": "string"},
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

const onSelectBppProviders = {
    "id": "/onSelectBppProviders",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "descriptor": {"$ref": "/onSelectBppDescriptor"},
        // "@ondc/org/fssai_license_no": {"type": "string"},
        "ttl": {"type": "string"},
        "locations": {"type": "array"},
        "items":{"$ref": "/onSelectItems"}
    },
}

const onSelectMessage = {
    "id": "/onSelectMessage",
    "type": "object",
    "required": ["catalog"],
    "additionalProperties": true,    
  
    "properties": {
        "catalog": {
            "type": "object",
            "required": ["bpp/fulfillments", "bpp/descriptor", "bpp/providers"],
            "properties": {
                "bpp/fulfillments":{"$ref": "/onSelectBppFulfillments"},
                "bpp/descriptor": {"type": "/onSelectBppDescriptor"},
                "bpp/providers": {"type": "/onSelectBppProviders"},
                "quote": {"type": "object"}
            },
        },
    }
};
  
const onSelect = {
    "id": "/onSelect",
    "type": "object",
    "properties": {
        "context": {"$ref": "/onSelectContext"},
        "message": {"$ref": "/onSelectMessage"},
      }
  };
  
  export  { onSelectContext, onSelectMessage, onSelect, onSelectBppFulfillments, onSelectBppDescriptor, onSelectItems, onSelectBppProviders};