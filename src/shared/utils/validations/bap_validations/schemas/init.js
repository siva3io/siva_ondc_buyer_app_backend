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

const initContext = {
    "id": "/initContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "init" ]},
        "core_version": {"type": "string"},
        "bap_id": {"type": "string"},
        "bap_uri": {"type": "string"},
        "bpp_id": {"type": "string"},
        "bpp_uri": {"type": "string"},
        "transaction_id": {"type": "string"},
        "message_id": {"type": "string"},
        "city": {"type": "string"},
        "country": {"type": "string"},
        "timestamp": {"type": "string"},
        "ttl": {"type": "string"}
      }
};
  
const initProvider = {
"id": "/initProvider",
"type": "object",
"required": ["id", "locations"],
"properties": {
    "id": {"type": "string"},
    "locations": {
        "type": "object",
        "required": ["id"],
        "properties": {
            "id": {"type": "string"},   
            },
        }
    }
};

const initBilling = {
    "id": "/initBilling",
    "type": "object",
    "required": ["name", "address"],
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
        "phone": {"type": "string"},
        "email": {"type": "string"},
        }
    }
};

const initItems = {
    "id": "/initItems",
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

const initEnd = {
    "id": "/initEnd",
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
        
const initFulfillments = {
    "id": "/initFulfillments",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "type": {"type": "string"},
        "provider_id": {"type": "string"},
        "tracking": {"enum": [ false, true ]},
        "end": {"$ref": "/initEnd"}, 
    },            
};

const initMessage = {
    "id": "/initMessage",
    "type": "object",
    "required": ["order"],
    "additionalProperties": true,    

    "properties": {
        "order": {
            "type": "object",
            "required": ["provider", "items", "billing", "fulfillments"],
            "properties": {
                "provider":{"$ref": "/initProvider"},
                "items": {"$ref": "/initItems"},
                "billing": {"$ref": "/initBilling"},
                "fulfillments": {"$ref": "/initFulfillments"},
            },
        },
    }
};
  
const init = {
    "id": "/init",
    "type": "object",
    "properties": {
        "context": {"$ref": "/initContext"},
        "message": {"$ref": "/initMessage"},
      }
};

export { initContext, initMessage, init, initProvider, initBilling, initItems, initEnd, initFulfillments };