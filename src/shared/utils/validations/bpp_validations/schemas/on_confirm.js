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

const onConfirmContext = {
    "id": "/onConfirmContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "on_confirm" ]},
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
        }
};

const onConfirmProvider = {
"id": "/onConfirmProvider",
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

const onConfirmItems = {
"id": "/onConfirmItems",
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
    
const onConfirmBilling = {
    "id": "/onConfirmBilling",
    "type": "object",
    "required": ["name", "address", "email", "phone", "created_at", "updated_at"],
    "properties": {
        "name": {"type": "string"},
        "email": {"type": "string"},
        "phone": {"type": "string"},
        "created_at": {"type": "string"},
        "updated_at": {"type": "string"},
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
        }
    }
};
        
const onConfirmEnd = {
    "id": "/onConfirmEnd",
    "type": "object",
    "required": ["time", "contact", "location", "instructions"],
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
        "time":{
            "type": "object",
            "required": ["range"],
            "properties": {
                "range": {
                    "type": "object",
                    "required": ["start", "end"],
                    "properties": {
                        "start": {"type": "string"},
                        "end": {"type": "string"},
                        }
                    }
                }
        },
        "instructions":{
            "type": "object",
            "required": ["name", "short_desc"],
            "properties": {
                "name": {"type": "string"},
                "short_desc": {"type": "string"},
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

const onConfirmStart = {
    "id": "/onConfirmStart",
    "type": "object",
    "required": ["time", "contact", "location", "instructions"],
    "properties": {
        "location": {
            "type": "object",
            "required": ["gps", "descriptor", "id"],
            "properties": {
                "gps": {"type": "string"},
                "id": {"type": "string"},
                "descriptor": {
                    "type": "object",
                    "required": ["name"],
                    "properties": {
                        "name": {"type": "string"}, 
                        }
                    } 
                }
        },
        "time":{
            "type": "object",
            "required": ["range"],
            "properties": {
                "range": {
                    "type": "object",
                    "required": ["start", "end"],
                    "properties": {
                        "start": {"type": "string"},
                        "end": {"type": "string"},
                        }
                    }
                }
        },
        "instructions":{
            "type": "object",
            "required": ["name", "short_desc"],
            "properties": {
                "name": {"type": "string"},
                "short_desc": {"type": "string"},
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

const onConfirmFulfillments = {
    "id": "/onConfirmFulfillments",
    "type": "array",
    "items":{
        "id": {"type": "string"},
        "@ondc/org/provider_name": {"type": "string"},
        "state": {
            "type": "object",
            "required": ["descriptor"],
            "properties": {
                "descriptor": {
                    "type": "object",
                    "required": ["name", "code"],
                    "properties": {
                        "name": {"type": "string"},
                        "code": {"type": "string"}
                        }
                }
            }
        },
        "type": {"type": "string"},
        "tracking": {"enum": [ false, true ]},
        "provider_id": {"type": "string"},
        "start": {"$ref": "/onConfirmStart"},
        "end": {"$ref": "/onConfirmEnd"},
    },            
};
     
const onConfirmPrice = {
    "id": "/onConfirmPrice",
    "type": "object",
        "required": ["currency", "value"],
        "properties": {
            "currency": {"type": "string"},
            "value": {"type": "string"},
        }
}

const onConfirmQuote = {
"id": "/onConfirmQuote",
"type": "object",
"required": ["price", "breakup"],
"properties": {
    "price": {"$ref": "/onConfirmPrice"},
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
        "end": {"$ref": "/onConfirmPayment"}
        }
    }
};

const onConfirmPayment = {
"id": "/onConfirmPayment",
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

const onConfirmMessage = {
"id": "/onConfirmMessage",
"type": "object",
"required": ["order"],
"additionalProperties": true,    
"properties": {
    "order": {
        "type": "object",
        "required": ["id", "state", "provider", "items", "billing", "fulfillments", "quote", "payment", "created_at", "updated_at"],
        "properties": {
            "id": {"type": "string"},
            "state": {"type": "string"},
            "provider": {"$ref": "/onConfirmProvider"},
            "items": {"$ref": "/onConfirmItems"},
            "billing": {"$ref": "/onConfirmBilling"},
            "fulfillments": {"$ref": "/onConfirmFulfillments"},
            "quote": {"$ref": "/onConfirmQuote"},
            "payment": {"$ref": "/onConfirmPayment"},
            "created_at": {"type": "string"},
            "updated_at": {"type": "string"},
    },
    }
}
};

const onConfirm = {
"id": "/onConfirm",
"type": "object",
"properties": {
    "context": {"$ref": "/onConfirmContext"},
    "message": {"$ref": "/onConfirmMessage"},
    }
};

export  { onConfirmContext, onConfirmMessage, onConfirm, onConfirmPayment, onConfirmQuote, onConfirmPrice, onConfirmFulfillments, onConfirmStart, onConfirmEnd, onConfirmBilling, onConfirmItems, onConfirmProvider};