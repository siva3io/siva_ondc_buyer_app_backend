//const Validator = require('jsonschema').Validator;
import Validator from 'jsonschema'
import { onCancelContext, onCancelMessage, onCancel } from "./schemas/on_cancel.js";
import { onConfirmContext, onConfirmMessage, onConfirm, onConfirmPayment, onConfirmQuote, onConfirmPrice, onConfirmFulfillments, onConfirmStart, onConfirmEnd, onConfirmBilling, onConfirmItems, onConfirmProvider } from "./schemas/on_confirm.js";
import { onInitContext, onInitMessage, onInit, onInitPayment, onInitQuote, onInitPrice, onInitFulfillments, onInitEnd, onInitItems, onInitBilling, onInitProvider } from "./schemas/on_init.js";
import { onSearchContext, onSearchMessage, onSearch, onSearchDescriptor, onSearchItems } from "./schemas/on_search.js";
import { onSelectContext, onSelectMessage, onSelect, onSelectBppFulfillments, onSelectBppDescriptor, onSelectItems, onSelectBppProviders } from "./schemas/on_select.js";
import { onStatusContext, onStatusMessage, onStatus } from "./schemas/on_status.js";
import { onSupportContext, onSupportMessage, onSupport } from "./schemas/on_support.js";
import { onTrackContext, onTrackMessage, onTrack } from "./schemas/on_track.js";
import { onUpdateContext, onUpdateMessage, onUpdate } from "./schemas/on_update.js";
import { issueContext, issueMessage, issue } from './schemas/issue.js';

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

var v = new Validator.Validator();

class BAPValidator{


async validateOnCancel(data){
    v.addSchema(onCancelContext, '/onCancelContext');
    v.addSchema(onCancelMessage, '/onCancelMessage');
    var response  = await v.validate(data, onCancel)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnConfirm(data){
    v.addSchema(onConfirmPayment, '/onConfirmPayment');
    v.addSchema(onConfirmQuote, '/onConfirmQuote');
    v.addSchema(onConfirmPrice, '/onConfirmPrice');
    v.addSchema(onConfirmFulfillments, '/onConfirmFulfillments');
    v.addSchema(onConfirmStart, '/onConfirmStart');
    v.addSchema(onConfirmEnd, '/onConfirmEnd');
    v.addSchema(onConfirmBilling, '/onConfirmBilling');
    v.addSchema(onConfirmItems, '/onConfirmItems');
    v.addSchema(onConfirmProvider, '/onConfirmProvider');
    v.addSchema(onConfirmContext, '/onConfirmContext');
    v.addSchema(onConfirmMessage, '/onConfirmMessage');
    var response  = await v.validate(data, onConfirm)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnInit(data){
    v.addSchema(onInitPayment, '/onInitPayment');
    v.addSchema(onInitQuote, '/onInitQuote');
    v.addSchema(onInitPrice, '/onInitPrice');
    v.addSchema(onInitFulfillments, '/onInitFulfillments');
    v.addSchema(onInitEnd, '/onInitEnd');
    v.addSchema(onInitItems, '/onInitItems');
    v.addSchema(onInitBilling, '/onInitBilling');
    v.addSchema(onInitProvider, '/onInitProvider');
    v.addSchema(onInitContext, '/onInitContext');
    v.addSchema(onInitMessage, '/onInitMessage');
    var response  = await v.validate(data, onInit)
    if (response["errors"].length == 0){
        // quote.price.value = Σ (quote.breakup.price.value)
        var quote_price_value = parseFloat(data["message"]["order"]["quote"]["price"]["value"])
        var total = 0
        var breakup = data["message"]["order"]["quote"]["breakup"]
        for(let i = 0; i < breakup.length; i++) {
            let value = breakup[i]["price"]["value"];
            total = total + value
        }
        if (quote_price_value != total){
            return false
        }

        // Quote.breakup should have 1 entry for each “@ondc/org/item-id”
        if (breakup.length == 0){
            return false
        }
        return true
    }
    return false
}

async validateOnSearch(data){
    v.addSchema(onSearchDescriptor, '/onSearchDescriptor');
    v.addSchema(onSearchItems, '/onSearchItems');
    v.addSchema(onSearchContext, '/onSearchContext');
    v.addSchema(onSearchMessage, '/onSearchMessage');

    var response  = await v.validate(data, onSearch)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnSelect(data){
    v.addSchema(onSelectContext, '/onSelectContext');
    v.addSchema(onSelectMessage, '/onSelectMessage');
    v.addSchema(onSelectBppFulfillments, '/onSelectBppFulfillments');
    v.addSchema(onSelectBppDescriptor, '/onSelectBppDescriptor');
    v.addSchema(onSelectItems, '/onSelectItems');
    v.addSchema(onSelectBppProviders, '/onSelectBppProviders');
    var response  = await v.validate(data, onSelect)
    if (response["errors"].length == 0){
        // later on need to add validations for Packaged Commodities, Packaged Foods, Fruits and Vegetables
        
        var bpp_providers = data["message"]["catlog"]["bpp/providers"]
        var items = {}
        var category_id = ""

        // “bpp/providers”.”@ondc/org/fssai_license_no” is mandatory for category_id “F&B”
        for(let i = 0; i < bpp_providers.length; i++) {
            items = bpp_providers[i]["items"]
            for (let j = 0; j < items.length; j++) {
                category_id = items[j]["category_id"]
                if  (category_id == "F&B"){
                    break
                }
            
            }
            
            if (category_id == "F&B"){
                if (!("@ondc/org/fssai_license_no" in bpp_providers[i])){
                    return false
                }
            }
        }
        // items.”@ondc/org/return_window” is mandatory only if items.”@ondc/org/returnable” is “true”;
        for(let i = 0; i < bpp_providers.length; i++) {
            items = bpp_providers[i]["items"]
            for (let j = 0; j < bpp_providers.length; j++) {
                if (items[j]["@ondc/org/returnable"] == true){
                    if (!("@ondc/org/return_window" in bpp_providers[i])){
                        return false
                    }   
                }
            }            
            total = total + value
        }
        return true
    }
    return false
}

async validateOnStatus(data){
    v.addSchema(onStatusContext, '/onStatusContext');
    v.addSchema(onStatusMessage, '/onStatusMessage');
    var response  = await v.validate(data, onStatus)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnSupport(data){
    v.addSchema(onSupportContext, '/onSupportContext');
    v.addSchema(onSupportMessage, '/onSupportMessage');
    var response  = await v.validate(data, onSupport)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateIssue(data){
    v.addSchema(issueContext, '/issueContext');
    v.addSchema(issueMessage, '/issueMessage');
    var response  = await v.validate(data, issue)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnTrack(data){
    v.addSchema(onTrackContext, '/onTrackContext');
    v.addSchema(onTrackMessage, '/onTrackMessage');
    var response  = await v.validate(data, onTrack)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async validateOnUpdate(data){
    v.addSchema(onUpdateContext, '/onUpdateContext');
    v.addSchema(onUpdateMessage, '/onUpdateMessage');
    var response  = await v.validate(data, onUpdate)
    if (response["errors"].length == 0){
        return true
    }
    return false
}

async itemsPayload(){
    var items =  [
        {
          "id": "QIXT84MBsSo6iBSYR5P8",
          "descriptor": {
            "name": "Arrow Men Shirt",
            "symbol": "https://m.media-amazon.com/images/S/aplus-media-library-service-media/0bc9b94e-96ea-4e7d-b058-0e55c883c62c.__CR0,156,2503,751_PT0_SX600_V1___.png",
            "short_desc": "This shirt by Arrow is a must have item in every guys wardrobe. To ensure all day long comfort, it's made from fluid fabric and has long sleeves. Whether it be a brunch date or an office meeting, style this pair with a slim fit denims or trousers and loafers.",
            "long_desc": "Since 1851, Arrow has been the authority in dressing gentlemen with a New York point of view, with its unmistakable premium elegance. With its heritage of innovation, Arrow has introduced the detachable collar, launched trousers with the adjustable waistbands and brought wrinkle-free, stain-free concepts to clothing. Today, Arrow has an interesting formal range that suits corporates with legacy, a stylish yet relaxed work wear for digital space honchos and cool young fashion for fired up Start-up founders working from coffee shops and co-working spaces. Every piece of clothing is designed to reflect the confident persona of the Arrow man with interesting self-expression in every elegant detail of the premium garment",
            "images": [
              "https://m.media-amazon.com/images/I/81PbJp1B01L._UX466_.jpg",
              "https://m.media-amazon.com/images/I/81zXDnlFlHL._UX466_.jpg",
              "https://m.media-amazon.com/images/I/81DHih4-wkL._UX466_.jpg",
              "https://m.media-amazon.com/images/I/71-3hR4p2EL._UX466_.jpg"
            ]
          },
          "quantity": {
            "available": {
              "count": "1"
            },
            "maximum": {
              "count": "2"
            }
          },
          "price": {
            "currency": "INR",
            "value": "899.0",
            "maximum_value": "1999.0"
          },
          "category_id": "Fashion",
          "fulfillment_id": "1",
          "location_id": "SIVA-ONDC-STORE-1-LOC-1", 
          "@ondc/org/returnable": "true",
          "@ondc/org/cancellable": "true",
          "@ondc/org/return_window": "P7D",
          "@ondc/org/seller_pickup_return": "true",
          "@ondc/org/time_to_ship": "PT45M",
          "@ondc/org/available_on_cod": "true",
          "@ondc/org/contact_details_consumer_care": "Arvind Fashions Ltd, Duparc Trinity Bengaluru 5600",
          "@ondc/org/statutory_reqs_packaged_commodities": {
            "manufacturer_or_packer_name": "Arvind Fashions Ltd",
            "manufacturer_or_packer_address": "Arvind Fashions Ltd, Duparc Trinity Bengaluru 560001",
            "common_or_generic_name_of_commodity": "Slim Fit Shirt",
            "net_quantity_or_measure_of_commodity_in_pkg": "1",
            "month_year_of_manufacture_packing_import": "08/2022"
          },
          "@ondc/org/statutory_reqs_prepackaged_food": {
            "nutritional_info": "",
            "additives_info": "",
            "brand_owner_FSSAI_license_no": "",
            "other_FSSAI_license_no": "",
            "importer_FSSAI_license_no": ""
          },
          "@ondc/org/mandatory_reqs_veggies_fruits": {
            "net_quantity": "100g"
          },
          "tags": {
            "product_type": "Casual Shirts",
            "brand_name": "Arrow",
            "color":  "white",
            "gender": "male",
            "size": "L",
            "country_of_origin": "India"
          }
        }
      ]
    return items
}

}
export default BAPValidator;