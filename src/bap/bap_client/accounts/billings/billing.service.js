import { v4 as uuidv4 } from 'uuid';
import NoRecordFoundError from '../../../../shared/lib/errors/no-record-found.error.js';
import BillingMongooseModel from './db/billing.js';

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

class BillingService {

    /**
    * add billing address
    * @param {Object} request
    * @param {Object} user
    */
    async billingAddress(request = {}, user = {}) {
        try {
            const billingSchema = {
                id: uuidv4(),
                userId: user?.decodedToken?.uid,
                address: { ...request?.address },
                organization: request?.organization,
                locationId: request?.locationId,
                email: request?.email,
                phone: request?.phone,
                taxNumber: request?.taxNumber,
                name: request?.name,
            };

            let storedBillingAddress = await BillingMongooseModel.create({ ...billingSchema });
            storedBillingAddress = storedBillingAddress?.toJSON();

            return {
                id: storedBillingAddress?.id,
                address: {
                    ...storedBillingAddress?.address,
                },
                organization: storedBillingAddress?.organization,
                locationId: storedBillingAddress?.locationId,
                email: storedBillingAddress?.email,
                phone: storedBillingAddress?.phone,
                taxNumber: storedBillingAddress?.taxNumber,
                name: storedBillingAddress?.name,
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * get billing address details
     * @param {Object} user
     */
    async onBillingDetails(user = {}) {
        try {
            const billingDetails = await BillingMongooseModel.find({
                userId: user?.decodedToken?.uid
            });

            return billingDetails;
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * update billing address
    * @param {String} id
    * @param {Object} request
    */
    async updateBillingAddress(id, request = {}) {
        try {
            const billingSchema = {
                address: { ...request?.address },
                organization: request?.organization,
                locationId: request?.locationId,
                email: request?.email,
                phone: request?.phone,
                taxNumber: request?.taxNumber,
                name: request?.name,
            };

            let storedBillingAddress = await BillingMongooseModel.findOneAndUpdate(
                { id: id },
                { ...billingSchema },
                {
                    returnDocument: "after",
                }
            );
            storedBillingAddress = storedBillingAddress?.toJSON();
            
            if(storedBillingAddress)
                return {
                    id: storedBillingAddress?.id,
                    address: {
                        ...storedBillingAddress?.address,
                    },
                    organization: storedBillingAddress?.organization,
                    locationId: storedBillingAddress?.locationId,
                    email: storedBillingAddress?.email,
                    phone: storedBillingAddress?.phone,
                    taxNumber: storedBillingAddress?.taxNumber,
                    name: storedBillingAddress?.name,
                };
            else
                throw new NoRecordFoundError(`Billing address with ${id} not found`);
        }
        catch (err) {
            throw err;
        }
    }
}

export default BillingService;
