import {Router} from 'express';
import { authentication } from '../../../shared/middlewares/index.js';

import BillingController from './billings/billing.controller.js';
import DeliveryAddressController from './deliveryAddress/deliveryAddress.controller.js';

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

const rootRouter = new Router();

const billingController = new BillingController();
const deliveryAddressController = new DeliveryAddressController();

//#region billing details

rootRouter.post(
    '/v1/billing_details', 
    authentication,
    billingController.billingAddress,
);

rootRouter.get('/v1/billing_details', authentication, billingController.onBillingDetails);

rootRouter.post(
    '/v1/update_billing_details/:id', 
    authentication,
    billingController.updateBillingAddress,
);

//#endregion

//#region delivery address details

rootRouter.post(
    '/v1/delivery_address', 
    authentication,
    deliveryAddressController.deliveryAddress,
);

rootRouter.get(
    '/v1/delivery_address', 
    authentication, 
    deliveryAddressController.onDeliveryAddressDetails
);

rootRouter.post(
    '/v1/update_delivery_address/:id', 
    authentication,
    deliveryAddressController.updateDeliveryAddress,
);
//#endregion
export default rootRouter;
