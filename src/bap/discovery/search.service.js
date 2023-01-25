import BppSearchService from "./bppSearch.service.js";
import BAPValidator from "../../shared/utils/validations/bap_validations/validations.js"

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

const bppSearchService = new BppSearchService();

class SearchService {

    /**
    * search
    * @param {Object} searchRequest
    */
    async ONDCSearch(searchRequest = {}, res) {
        try {

            // logger.info(`[SearchService][search] Search product`, {params: searchRequest});

            const { context: requestContext = {}, message = {} } = searchRequest;
            const { item = {}, category = {}, fulfillment = [], payment = {} } = message?.intent;

            //TODO
            //Validations for Search with item for search string
            //Validations for Search with city
            //Validations for Search with category
            var mode = ""
            if (Object.keys(item).length > 0) {
                mode = "item"
            } else if (Object.keys(category).length > 0) {
                mode = "category"
            } else if (Object.keys(fulfillment).length > 0) {
                mode = "city"
            } else {
                return res.status(401)
                    .json({
                        message: {
                            "ack": { "status": "NACK" },
                            "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" }
                        }
                    })
            }

            var validation_flag = new BAPValidator().validateSearch(searchRequest, mode)

            if (!validation_flag) {
                return res.status(401)
                    .json({
                        message: {
                            "ack": { "status": "NACK" },
                            "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" }
                        }
                    })
            }



            return await bppSearchService.ONDCSearch(searchRequest);

        }
        catch (err) {
            throw err;
        }
    }

    async ONDCSearchEvent(searchRequest = {}) {
        try {

            // logger.info(`[SearchService][search] Search product`, {params: searchRequest});
            const { context: requestContext = {}, message = {} } = searchRequest;
            const { item = {}, category = {}, fulfillment = [], payment = {} } = message?.intent;

            //TODO
            //Validations for Search with item for search string
            //Validations for Search with city
            //Validations for Search with category
            var mode = ""
            if (Object.keys(item).length > 0) {
                mode = "item"
            } else if (Object.keys(category).length > 0) {
                mode = "category"
            } else if (Object.keys(fulfillment).length > 0) {
                mode = "city"
            } else {
                return {
                        message: {
                            "ack": { "status": "NACK" },
                            "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" }
                        }
                    }
            }

            var validation_flag = new BAPValidator().validateSearch(searchRequest, mode)

            if (!validation_flag) {
                return {
                        message: {
                            "ack": { "status": "NACK" },
                            "error": { "type": "Gateway", "code": "10000", "message": "Bad or Invalid request error" }
                        }
                    }
            }
            return await bppSearchService.ONDCSearch(searchRequest);
        }
        catch (err) {
            throw err;
        }
    }
}

export default SearchService;
