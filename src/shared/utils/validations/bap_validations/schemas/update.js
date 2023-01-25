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

const updateContext = {
    "id": "/updateContext",
    "type": "object",
    "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri", "ttl"],
    "additionalProperties": true,    
    "properties": {
        "domain": {"type": "string"},
        "action": {"enum": [ "update" ]},
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
  

  const updateMessage = {
    "id": "/updateMessage",
    "type": "object",
    "required": ["update_target", "order"],
    "additionalProperties": true,    
    "properties": {
        "update_target": {"type": "string"},
        "order": {"type": "object"},
        }
};
  
const update = {
    "id": "/update",
    "type": "object",
    "properties": {
        "context": {"$ref": "/updateContext"},
        "message": {"$ref": "/updateMessage"},
      }
  };
  
  export { updateContext, updateMessage, update};