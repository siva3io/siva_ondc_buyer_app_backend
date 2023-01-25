import {Router} from 'express';
import authentication from '../../../shared/middlewares/authentication.js';
import ProductController from './products.controller.js';
const router = new Router();

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

const productController = new ProductController();

// get order status
router.post('/product/create',  productController.CreateProduct);
router.post('/product/:id/update',  productController.UpdateProduct);
router.get('/product_list', productController.ListProduct);
router.get('/product_view/:id',productController.ViewProduct);
// router.get('/product/get',  paymentController.getOrderStatus);

export default router;
