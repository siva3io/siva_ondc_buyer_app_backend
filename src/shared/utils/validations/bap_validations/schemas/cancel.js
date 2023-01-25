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

const cancelContext = {
  "id": "/cancelContext",
  "type": "object",
  "required": ["domain", "action", "country", "city", "core_version", "bap_id", "bap_uri", "transaction_id", "message_id", "timestamp", "bpp_id", "bpp_uri"],
  "additionalProperties": true,    
  "properties": {
      "domain": {"type": "string"},
      "country": {"type": "string"},
      "city": {"type": "string"},
      "action": {"enum": [ "cancel" ]},
      "core_version": {"type": "string"},
      "bap_id": {"type": "string"},
      "bap_uri": {"type": "string"},
      "bpp_id": {"type": "string"},
      "bpp_uri": {"type": "string"},
      "transaction_id": {"type": "string"},
      "message_id": {"type": "string"},
      "timestamp": {"type": "string"},
      "ttl": {"type": "string"},
    }
};

const cancelMessage = {
  "id": "/cancelMessage",
  "type": "object",
  "required": ["order_id", "cancellation_reason_id"],
  "additionalProperties": true,    

  "properties": {
      "order_id":  {"type": "string"},
      "cancellation_reason_id":  {"type": "string"},
  }
};

const cancel = {
  "id": "/cancel",
  "type": "object",
  "properties": {
      "context": {"$ref": "/cancelContext"},
      "message": {"$ref": "/cancelMessage"},
    }
};

export  { cancelContext, cancelMessage, cancel}