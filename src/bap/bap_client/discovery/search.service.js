import ContextFactory from "../../../shared/factories/ContextFactory.js";
import BppSearchService from "./bppSearch.service.js";
import HttpRequest from "../../../shared/utils/HttpRequest.js";

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
    async search(searchRequest = {}, companyId = 1, authToken = "") {
        try {

            const { context: requestContext = {}, message = {} } = searchRequest;
            const { criteria = {}, payment } = message;

            var uri = process.env.EUNIMART_CORE_HOST;
            var baseURL = process.env.USER_COMPANY_DETAILS_BASE_PATH + companyId.toString();
            
            if (payment == null || payment == {}){  
                try{
                const apiCall = new HttpRequest(uri,
                    baseURL,
                    "GET",
                    {},
                    {
                        "Authorization": authToken,
                        "Accept": "application/json"
                    }
                );
                const company_result = await apiCall.send();
                payment.buyer_app_finder_fee_type = company_result?.data?.data?.ondc_details?.buyer_app_finder_fee_type
                payment.buyer_app_finder_fee_amount = company_result?.data?.data?.ondc_details?.buyer_app_finder_fee_amount
                }
                catch(e){
                    payment.buyer_app_finder_fee_type = process.env.BAP_FINDER_FEE_TYPE
                    payment.buyer_app_finder_fee_amount = process.env.BAP_FINDER_FEE_AMOUNT
                }
            
            }
            const contextFactory = new ContextFactory();
            const protocolContext = contextFactory.create({
                transactionId: requestContext?.transaction_id,
                bppId: requestContext?.bpp_id,
                bppUrl: requestContext?.bpp_uri,
                city: requestContext.city,
                state: requestContext.state,
                cityCode: requestContext.cityCode,
            });
            
            return await bppSearchService.search(
                protocolContext,
                { criteria, payment }
            );

        }
        catch (err) {
            throw err;
        }
    }

}

export default SearchService;
