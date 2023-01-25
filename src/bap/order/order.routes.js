import {Router} from 'express';
import { authentication } from '../../shared/middlewares/index.js';

import CancelOrderController from './cancel/cancelOrder.controller.js';
import ConfirmOrderController from './confirm/confirmOrder.controller.js';
import InitOrderController from './init/initOrder.controller.js';
import OrderHistoryController from './history/orderHistory.controller.js';
import SelectOrderController from './select/selectOrder.controller.js';
import UpdateOrderController from './update/updateOrder.controller.js';
import OrderStatusController from './status/orderStatus.controller.js';
// import { searchProductbyName } from './db/dbService.js';

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

const cancelOrderController = new CancelOrderController();
const confirmOrderController = new ConfirmOrderController();
const initOrderController = new InitOrderController();
const orderHistoryController = new OrderHistoryController();
const orderStatusController = new OrderStatusController();
const selectOrderController = new SelectOrderController();
const updateOrderController = new UpdateOrderController();


rootRouter.get(
    '/test',
    selectOrderController.test,
);

// select order v1
rootRouter.post(
    '/bap/eunimart_bap/select',
    selectOrderController.ONDCSelectOrder,
);

// select order v1
rootRouter.post(
    '/bap/eunimart_bap/full_details/select',
    selectOrderController.selectOrder,
);

// init order v1
rootRouter.post(
    '/bap/eunimart_bap/init',
    initOrderController.ONDCInitOrder,
);

// init order v1
rootRouter.post(
    '/bap/eunimart_bap/full_details/init',
    initOrderController.initOrder,
);

// confirm order v1
rootRouter.post(
    '/bap/eunimart_bap/confirm',
    confirmOrderController.ONDCConfirmOrder,
);

// confirm order v1
rootRouter.post(
    '/bap/eunimart_bap/full_details/confirm',
    confirmOrderController.confirmOrder,
);

// cancel order v1
rootRouter.post(
    '/bap/eunimart_bap/cancel',
    cancelOrderController.ONDCCancelOrder,
);

// cancel order v1
rootRouter.post(
    '/bap/eunimart_bap/full_details/cancel',
    cancelOrderController.cancelOrder,
);

// update order v1
rootRouter.post(
    '/bap/eunimart_bap/update',
    updateOrderController.ONDCUpdateOrder,
);


// update order v1
rootRouter.post(
    '/bap/eunimart_bap/full_detatils/update',
    updateOrderController.updateOrder,
);

// status order v1
rootRouter.post(
    '/bap/eunimart_bap/status',
    orderStatusController.ONDCStatusOrder,
);

// update order v1
rootRouter.post(
    '/bap/eunimart_bap/full_details/status',
    orderStatusController.statusOrder,
);

export default rootRouter;
