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

const onInitContext = {
    "id": "/onInitContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "on_init" ]},
        "core_version": {"type": "string"},
        "bap_id": {"type": "string"},
        "bap_uri": {"type": "string"},
        "bpp_id": {"type": "string"},
        "bpp_uri": {"type": "string"},
        "transaction_id": {"type": "string"},
        "message_id": {"type": "string"},
        "country": {"type": "string"},
        "city": {"type": "string"},
        "timestamp": {"type": "string"},
      }
};
  
const onInitProvider = {
"id": "/onInitProvider",
"type": "object",
"required": ["id"],
"properties": {
    "id": {"type": "string"},
    }
};

const onInitBilling = {
    "id": "/onInitBilling",
    "type": "object",
    "required": ["name", "address", "phone", "email", "created_at", "updated_at"],
    "properties": {
        "name": {"type": "string"},
        "address": {
            "type": "",
            "required": ["door","name","locality","city","state","country","area_code"],
            "properties": {
                "door": {"type": "string"},
                "name": {"type": "string"},
                "locality": {"type": "string"},
                "city": {"type": "string"},
                "state": {"type": "string"},
                "country": {"type": "string"},
                "area_code": {"type": "string"},
            },
        },
        "phone": {"type": "string"},
        "email": {"type": "string"},
        "created_at": {"type": "string"},
        "updated_at": {"type": "string"},
    }
};

const onInitItems = {
    "id": "/onInitItems",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "fulfillment_id": {"type": "string"},
        "quantity":{
            "type": "object",
            "required": ["count"],
            "properties": {
                "count": {"type": "integer"},
            }
        }
    }
};

const onInitEnd = {
    "id": "/onInitEnd",
    "type": "object",
    "required": ["contact", "location"],
    "properties": {
        "location": {
            "type": "object",
            "required": ["gps", "address"],
            "properties": {
                "gps": {"type": "string"},
                "address": {
                    "type": "object",
                    "required": ["door", "name", "locality", "city", "state", "country", "area_code"],
                    "properties": {
                        "door": {"type": "string"}, 
                        "name": {"type": "string"}, 
                        "locality": {"type": "string"}, 
                        "city": {"type": "string"}, 
                        "state": {"type": "string"}, 
                        "country": {"type": "string"}, 
                        "area_code": {"type": "string"}
                        }
                    } 
                }
        },
        "contact": {
            "type": "object",
            "required": ["email", "phone"],
            "properties": {
                "email": {"type": "string"},
                "phone": {"type": "string"}, 
            }
        },
    }
}
        
const onInitFulfillments = {
    "id": "/onInitFulfillments",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "type": {"type": "string"},
        "provider_id": {"type": "string"},
        "tracking": {"enum": [ false, true ]},
        "end": {"$ref": "/onInitEnd"}, 
    },            
};

const onInitPrice = {
    "id": "/onInitPrice",
    "type": "object",
        "required": ["currency", "value"],
        "properties": {
            "currency": {"type": "string"},
            "value": {"type": "string"},
        }
}

const onInitQuote = {
"id": "/onInitQuote",
"type": "object",
"required": ["price", "breakup"],
"properties": {
    "price": {"$ref": "/onInitPrice"},
    "breakup":{
        "type": "array",
        "items":{
            "@ondc/org/item_id": {"type": "string"},
            "@ondc/org/item_quantity": {
                "type": "object",
                "required": ["count"],
                "properties": {
                    "count": {"type": "intiger"}
            
            },
            "title": {"type": "string"},
            "@ondc/org/title_type": {"type": "string"},
            "price": {"type": "object"},   
        }
        },
        "created_at": {"type": "string"},
        "updated_at": {"type": "string"},
        "end": {"$ref": "/onInitPayment"}
        }
    }
};

const onInitPayment = {
"id": "/onInitPayment",
"type": "object",
"required": ["type","collected_by", 
    "@ondc/org/buyer_app_finder_fee_type",
    "@ondc/org/buyer_app_finder_fee_amount", 
    "@ondc/org/@ondc/org/withholding_amount", 
    "@ondc/org/return_window",
    "@ondc/org/settlement_details"],
"properties": {
    "type": {"type": "string"},
    "collected_by": {"type": "string"},
    "@ondc/org/buyer_app_finder_fee_type": {"type": "string"},
    "@ondc/org/buyer_app_finder_fee_amount": {"type": "string"},
    "@ondc/org/withholding_amount": {"type": "string"},
    "@ondc/org/return_window": {"type": "string"},
    "@ondc/org/settlement_basis": {"type": "string"},
    "@ondc/org/settlement_window": {"type": "string"},
    "@ondc/org/settlement_details": {
        "type": "array",
        "items": {
            "settlement_counterparty": {"type": "string"}, 
            "settlement_phase": {"type": "string"},
            "settlement_type": {"type": "string"}, 
            "upi_address": {"type": "string"}, 
            "settlement_bank_account_no": {"type": "string"},
            "settlement_ifsc_code": {"type": "string"},
            "beneficiary_name": {"type": "string"}, 
            "bank_name": {"type": "string"},
            "branch_name": {"type": "string"}, 
        }
    },
    "created_at": {"type": "string"},
    "updated_at": {"type": "string"},
    }
};

const onInitMessage = {
"id": "/onInitMessage",
"type": "object",
"required": ["order"],
"additionalProperties": true,    

"properties": {
    "order": {
        "type": "object",
        "required": ["provider", "provider_location", "items", "billing", "fulfillments"],
        "properties": {
            "provider":{"$ref": "/onInitProvider"},
            "provider_location":{
                "type": "object",
                "required": ["id"],
                "properties": {
                    "id": {"type": "string"},
                },
            "items": {"$ref": "/onInitItems"},
            "billing": {"$ref": "/onInitBilling"},
            "fulfillments": {"$ref": "/onInitFulfillments"},
            "quote": {"$ref": "/onInitQuote"},
            "payment": {"$ref": "/onInitPayment"},   
            },
        },
    }
    }
};
  
const onInit = {
    "id": "/init",
    "type": "object",
    "properties": {
        "context": {"$ref": "/onInitContext"},
        "message": {"$ref": "/onInitMessage"},
      }
};

export  { onInitContext, onInitMessage, onInit, onInitPayment, onInitQuote, onInitPrice, onInitFulfillments, onInitEnd, onInitItems, onInitBilling, onInitProvider};