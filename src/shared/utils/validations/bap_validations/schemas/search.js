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

const searchContext = {
    "id": "/searchContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "search" ]},
        "country": {"type": "string"},
        "city": {"type": "string"},
        "core_version": {"type": "string"},
        "bap_id": {"type": "string"},
        "bap_uri": {"type": "string"},
        "transaction_id": {"type": "string"},
        "message_id": {"type": "string"},
        "timestamp": {"type": "string"},
        "ttl": {"type": "string"},
      }
};

const searchByCityMessage = {
    "id": "/searchByCityMessage",
    "type": "object",
    "required": ["intent"],
    "additionalProperties": true,    
 
    "properties": {
        "intent": {
            "type": "object",
            "required": ["fulfillment", "payment"],
            "properties": {
                "fulfillment": {
                    "type": "object",
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string"}             
                }
                },
                "payment": {
                    "type": "object",
                    "required": ["@ondc/org/buyer_app_finder_fee_type"],
                    "properties": {
                        "@ondc/org/buyer_app_finder_fee_type": {"type": "string"},             
                        "@ondc/org/buyer_app_finder_fee_amount": {"type": "string"}
                }
                }
            },
        }
    }
};

const searchByItemMessage = {
    "id": "/searchByItemMessage",
    "type": "object",
    "required": ["intent"],
    "additionalProperties": true,    
 
    "properties": {
        "intent": {
            "type": "object",
            "required": ["item", "fulfillment", "payment"],
            "properties": {
                "item":{
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string"}             
                    }
                },
                "fulfillment": {
                    "type": "object",
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string"}             
                }
                },
                "payment": {
                    "type": "object",
                    "required": ["@ondc/org/buyer_app_finder_fee_type"],
                    "properties": {
                        "@ondc/org/buyer_app_finder_fee_type": {"type": "string"},             
                        "@ondc/org/buyer_app_finder_fee_amount": {"type": "string"}
                }
                }
            },
        }
    }
};

const searchByCategoryMessage = {
    "id": "/searchByCategoryMessage",
    "type": "object",
    "required": ["intent"],
    "additionalProperties": true,    
 
    "properties": {
        "intent": {
            "type": "object",
            "required": ["category", "fulfillment", "payment"],
            "properties": {
                "category":{
                    "type": "object",
                    "required": ["id"],
                    "properties": {
                        "id": {"type": "string"}             
                    }
                },
                "fulfillment": {
                    "type": "object",
                    "required": ["type"],
                    "properties": {
                        "type": {"type": "string"}             
                }
                },
                "payment": {
                    "type": "object",
                    "required": ["@ondc/org/buyer_app_finder_fee_type"],
                    "properties": {
                        "@ondc/org/buyer_app_finder_fee_type": {"type": "string"},             
                        "@ondc/org/buyer_app_finder_fee_amount": {"type": "string"}
                }
                }
            },
        }
    }
};

const searchByCity = {
    "id": "/searchByCity",
    "type": "object",
    "properties": {
        "context": {"$ref": "/searchContext"},
        "message": {"$ref": "/searchByCityMessage"},
      }
};

const searchByItem = {
    "id": "/searchByItem",
    "type": "object",
    "properties": {
        "context": {"$ref": "/searchContext"},
        "message": {"$ref": "/searchByItemMessage"},
      }
};

const searchByCategory = {
    "id": "/searchByCategory",
    "type": "object",
    "properties": {
        "context": {"$ref": "/searchContext"},
        "message": {"$ref": "/searchByCategoryMessage"},
      }
};

export { searchContext, searchByCategory, searchByItem, searchByCity, searchByCityMessage, searchByItemMessage, searchByCategoryMessage};
