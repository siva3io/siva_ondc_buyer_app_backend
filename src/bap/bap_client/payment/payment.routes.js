import {Router} from 'express';
import { authentication, juspayAuthentication } from '../../../shared/middlewares/index.js';

import PaymentController from './payment.controller.js';

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

const router = new Router();
const paymentController = new PaymentController();

// sign payload
router.post(
    '/payment/signPayload', 
    authentication,
    paymentController.signPayload,
);

// get order status
router.get('/payment/status/:orderId', authentication, paymentController.getOrderStatus);

// verify payment
router.post(
    '/payment/verify',
    juspayAuthentication(),
    paymentController.verifyPayment,
);

router.get('/payment/list/:id', paymentController.GetPayments);

router.get('/payments/list', paymentController.GetAllPayments);

router.get('/payment/download/:id', paymentController.DownloadPayments);

router.get('/payment/:id', paymentController.GetPayment);

router.post('/payment/:id', paymentController.UpdatePayment);

router.post('/payment/razorpay/callback', paymentController.UpdatePaymentRazorpayCallback);


export default router;
