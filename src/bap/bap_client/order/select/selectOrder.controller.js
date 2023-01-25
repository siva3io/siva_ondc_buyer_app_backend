import SelectOrderService from './selectOrder.service.js';
import JsonWebToken from '../../../../shared/lib/authentication/json-web-token.js'; 
import { searchProductbyName } from '../../../../shared/db/dbService.js';

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

const selectOrderService = new SelectOrderService();
const jsonWebToken = new JsonWebToken();

class SelectOrderController {

    // test("Arrow Men Shirt"),
    /**
    * select order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
     test(req, res, next) {
        searchProductbyName("Shirt").then(response => {
            
        var processDic = {}

        for(let i = 0; i < response.length; i++) {
            var tempData = response[i]
                
            if (tempData["provider_details"]["id"] in processDic){
                processDic[tempData["provider_details"]["id"]]["items"].push(
                    {
                        "id": tempData["id"],
                        "descriptor": tempData["descriptor"],
                        "quantity": tempData["quantity"],
                        "price": tempData["price"],
                        "category_id": tempData["category_id"],
                        "fulfillment_id": tempData["fulfillment_id"],
                        "location_id": tempData["provider_details"]["locations"][0]["id"],
                        "@ondc/org/returnable": tempData["is_returnable".toString()],
                        "@ondc/org/cancellable": tempData["is_cancellable".toString()],
                        "@ondc/org/return_window": tempData["return_window"],
                        "@ondc/org/seller_pickup_return": tempData["is_seller_pickup_return".toString()],
                        "@ondc/org/time_to_ship": tempData["time_to_ship".toString()],
                        "@ondc/org/available_on_cod": tempData["is_available_on_cod".toString()],
                        "@ondc/org/contact_details_consumer_care": tempData["contact_details_consumer_care".toString()],
                        "@ondc/org/statutory_reqs_packaged_commodities": tempData["statutory_reqs_packaged_commodities"],
                        "@ondc/org/statutory_reqs_prepackaged_food": tempData["statutory_reqs_prepackaged_food"],
                        "@ondc/org/mandatory_reqs_veggies_fruits": tempData["mandatory_reqs_veggies_fruits"],
                        "tags": tempData["tags"]
                    }
                )
            }
            else{
                processDic[tempData["provider_details"]["id"]] = {
                    "id": tempData["provider_details"]["id"],
                    "descriptor": tempData["descriptor"],
                    "ttl": "PT30M",
                    "locations": tempData["provider_details"]["locations"],
                    "items": [{
                        "id": tempData["id"],
                        "descriptor": tempData["descriptor"],
                        "quantity": tempData["quantity"],
                        "price": tempData["price"],
                        "category_id": tempData["category_id"],
                        "fulfillment_id": tempData["fulfillment_id"],
                        "location_id": tempData["provider_details"]["locations"][0]["id"],
                        "@ondc/org/returnable": tempData["is_returnable".toString()],
                        "@ondc/org/cancellable": tempData["is_cancellable".toString()],
                        "@ondc/org/return_window": tempData["return_window"],
                        "@ondc/org/seller_pickup_return": tempData["is_seller_pickup_return".toString()],
                        "@ondc/org/time_to_ship": tempData["time_to_ship".toString()],
                        "@ondc/org/available_on_cod": tempData["is_available_on_cod".toString()],
                        "@ondc/org/contact_details_consumer_care": tempData["contact_details_consumer_care".toString()],
                        "@ondc/org/statutory_reqs_packaged_commodities": tempData["statutory_reqs_packaged_commodities"],
                        "@ondc/org/statutory_reqs_prepackaged_food": tempData["statutory_reqs_prepackaged_food"],
                        "@ondc/org/mandatory_reqs_veggies_fruits": tempData["mandatory_reqs_veggies_fruits"],
                        "tags": tempData["tags"]
                    }                        
                    ]
                }
            }
        }
            
        var processList = []
        for (const [key, value] of Object.entries(processDic)) {
            processList.push(value)
          }
        
       
        res.json({ ...processList });
        //   res.processList
    }).catch((err) => {
            next(err);
        });
    }
    
    /**
    * select order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async selectOrder(req, res, next) {

        const { body: request } = req;
        
        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
        request["message"]["CreatedBy"] = decoded?.ID
        selectOrderService.selectOrder(request).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            // console.log("Error in SelectOrder (controller.js)");
            console.log(err);
            next(err);
        });
    }

    /**
    * select multiple orders
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async selectMultipleOrder(req, res, next) {
        const { body: requests } = req;

        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])

        let length = requests.length;
        let requestArray = [];

        if ( typeof length == 'undefined') {
            requestArray.push(requests);
        }
        else{
            requestArray = requests
        }

        for (let i = 0; i < requestArray.length; i++) {
            requestArray[i]["message"]["CreatedBy"] = decoded?.ID
        }

        selectOrderService.selectMultipleOrder(requestArray).then(response => {
            res.json(response);
        }).catch((err) => {
            next(err);
        });

    }
}

export default SelectOrderController;
