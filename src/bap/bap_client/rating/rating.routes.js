import { Router } from 'express';
import { authentication } from '../../../shared/middlewares/index.js';

import RatingController from './rating.controller.js';

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
const ratingController = new RatingController();

router.post(
    '/clientApis/bap/eunimart_bap/rating', authentication,
    ratingController.BapRating,
);

router.post(
    '/clientApis/bap/eunimart_bap/get_rating_categories',
    ratingController.getBapRatingCategories,
)

router.post(
    '/clientApis/bap/eunimart_bap/get_feedback_categories',
    ratingController.getBapFeedbackCategories,
)

router.post(
    '/clientApis/bap/eunimart_bap/get_feedback_form',
    ratingController.getBapFeedbackForm,
)

export default router;
