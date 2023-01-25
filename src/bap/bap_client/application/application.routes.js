import {Router} from 'express';
import { authentication } from '../../../shared/middlewares/index.js';
import ApplicationController from './application.controller.js';

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
const applicationController = new ApplicationController();

router.get('/cities', applicationController.Cities);

router.get('/stores', applicationController.Stores);

router.get('/address/:id', authentication, applicationController.GetAddress);

router.delete('/address/delete/:id/:address_id', authentication, applicationController.DeleteAddress);

router.post('/address/:id', authentication, applicationController.AddAddress);  // , validate({ body: updateShipment })

router.post('/address/update/:id', authentication, applicationController.UpdateAddress);  // , validate({ body: updateShipment })

router.get('/orders/:id', authentication, applicationController.GetOrders);

router.get('/allOrders', authentication, applicationController.GetAllOrders);

router.get('/get_order', authentication, applicationController.getOrderByTransactionId);

router.get('/clientApis/bpp/get_order', authentication, applicationController.getBPPOrderByTransactionId);

router.get('/orders/download/:id', applicationController.DownloadOrders);

router.post('/bap/subscribe', authentication, applicationController.ONDCSubscribe);

router.post('/bap/eunimart_bap/on_subscribe', authentication, applicationController.OnSubscribe);

router.post('/lsp_bap/eunimart_lsp_bap/on_subscribe', authentication, applicationController.OnSubscribe);

router.get('/reconciliation/list/:id', authentication, applicationController.GetReconciliations);

router.get('/reconciliation/download/:id', applicationController.DownloadReconciliations);

router.get('/reconciliation/:id', authentication, applicationController.GetReconciliation);

router.post('/reconciliation/:id', authentication, applicationController.UpdateReconciliation);

router.get('/payout_details/:id', authentication, applicationController.GetPayout);

router.get('/payout_details/list/:id', authentication, applicationController.GetPayouts);

router.get('/payout_details/download/:id', applicationController.DownloadPayouts);

router.post('/razorpay/create_order/', authentication, applicationController.CreateRazorPayOrder);

router.get('/cancellation_reasons', applicationController.CancellationReason);

router.get('/return_reasons', applicationController.ReturnReason);


//======================= cart Items =================================================================
router.post('/cart/item/upsert', authentication, applicationController. UpsertCartItem);
router.post('/cart/item/delete/:id', authentication, applicationController. DeleteCartItem);
router.post('/cart/delete', authentication, applicationController. DeleteCart);
router.get('/cart/item/list', authentication, applicationController. GetCartItemsOfUser);

router.get('/product_category/search',applicationController.SearchProductCategory)

//======================= Generate Ordr Csv ==========================================================
router.get('/generateOrderCsv',authentication, applicationController. GenerateOrderCsv);



export default router;
