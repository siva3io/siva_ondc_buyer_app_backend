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

const onStatusContext = {
    "id": "/onStatusContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "on_status" ]},
        "country": {"type": "string"},
        "city": {"type": "string"},
        "core_version": {"type": "string"},
        "bap_id": {"type": "string"},
        "bap_uri": {"type": "string"},
        "bpp_id": {"type": "string"},
        "bpp_uri": {"type": "string"},
        "transaction_id": {"type": "string"},
        "message_id": {"type": "string"},
        "timestamp": {"type": "string"},
        "ttl": {"type": "string"}
      }
  };
  

  const onStatusMessage = {
    "id": "/onStatusMessage",
    "type": "object",
    "required": ["id", "provider", "items", "billing", "fulfillments", "quote"],
    "additionalProperties": true,    
    "properties": {
        "id": {"type": "string"},
        "provider": {"type": "object"},
        "items": {"type": "array"},
        "billing": {"type": "object"},
        "fulfillments": {"type": "array"},
        "quote": {"type": "object"},
        "payment": {"type": "object"},
        "created_at": {"type": "object"},
        "updated_at": {"type": "object"},        
        }
};
  
const onStatus = {
    "id": "/status",
    "type": "object",
    "properties": {
        "context": {"$ref": "/onStatusContext"},
        "message": {"$ref": "/onStatusMessage"},
      }
  };
  
export  { onStatusContext, onStatusMessage, onStatus};