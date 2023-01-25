import { v4 as uuidv4 } from 'uuid';
import NoRecordFoundError from '../../../../shared/lib/errors/no-record-found.error.js';
import DeliveryAddressMongooseModel from './db/deliveryAddress.js';

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

class DeliveryAddressService {

    /**
    * add delivery address
    * @param {Object} request
    * @param {Object} user
    */
    async deliveryAddress(request = {}, user = {}) {
        try {
            const deliveryAddressSchema = {
                userId: user?.decodedToken?.uid,
                id: uuidv4(),
                descriptor: request?.descriptor,
                gps: request?.gps,
                defaultAddress: true,
                address: request?.address,
            };
                        
            await DeliveryAddressMongooseModel.updateMany(
                { userId: user.decodedToken.uid },
                { defaultAddress: false}
            );

            let storedDeliveryAddress = await DeliveryAddressMongooseModel.create(
                { ...deliveryAddressSchema}
            );
            storedDeliveryAddress = storedDeliveryAddress?.toJSON();

            return {
                id: storedDeliveryAddress?.id,
                descriptor: storedDeliveryAddress?.descriptor,
                gps: storedDeliveryAddress?.gps,
                defaultAddress: storedDeliveryAddress?.defaultAddress,
                address: storedDeliveryAddress?.address
            };
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * get delivery address
     * @param {Object} user
     */
    async onDeliveryAddressDetails(user = {}) {
        try {
            const deliveryAddressDetails = await DeliveryAddressMongooseModel.find({ 
                userId: user?.decodedToken?.uid
            });
            
            return deliveryAddressDetails;
        }
        catch (err) {
            throw err;
        }
    }

    /**
    * add delivery address
    * @param {String} id
    * @param {Object} request
    * @param {String} userId
    */
    async updateDeliveryAddress(id, request = {}, userId) {
        try {
            
            const deliveryAddressSchema = {
                descriptor: request?.descriptor,
                gps: request?.gps,
                defaultAddress: request?.defaultAddress,
                address: request?.address,
            };

            if(request?.defaultAddress)
                await DeliveryAddressMongooseModel.updateMany(
                    { userId: userId },
                    { defaultAddress: false}
                );

            let storedDeliveryAddress = await DeliveryAddressMongooseModel.findOneAndUpdate(
                { id: id },
                { ...deliveryAddressSchema},
                {
                    returnDocument: "after",
                }
            );
            storedDeliveryAddress = storedDeliveryAddress?.toJSON();

            if(storedDeliveryAddress)
                return {
                    id: storedDeliveryAddress?.id,
                    descriptor: storedDeliveryAddress?.descriptor,
                    gps: storedDeliveryAddress?.gps,
                    defaultAddress: storedDeliveryAddress?.defaultAddress,
                    address: storedDeliveryAddress?.address
                };
            else
                throw new NoRecordFoundError(`Delivery address with ${id} not found`);
        }
        catch (err) {
            throw err;
        }
    }

}

export default DeliveryAddressService;
