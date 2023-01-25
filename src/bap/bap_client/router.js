import { Router } from 'express';

import accountRoutes from "./accounts/accounts.routes.js";
import migrationsRoutes from "./migrations/migrations.routes.js";
import orderRoutes from "./order/order.routes.js";
import paymentRoutes from "./payment/payment.routes.js";
import searchRoutes from "./discovery/search.routes.js";
import supportRoutes from "./support/support.routes.js";
import trackRoutes from "./fulfillment/track.routes.js";
import rateRoutes from "./rating/rating.routes.js";
import applicationRoutes from "./application/application.routes.js";
import productRoutes from "./products/products.route.js";
import userRoutes from "./user/user.routes.js";

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

router.use(accountRoutes);
router.use(migrationsRoutes);
router.use(orderRoutes);
router.use(paymentRoutes);
router.use(searchRoutes);
router.use(supportRoutes);
router.use(trackRoutes);
router.use(applicationRoutes);
router.use(rateRoutes);
router.use(productRoutes);
router.use(userRoutes);


export default router;