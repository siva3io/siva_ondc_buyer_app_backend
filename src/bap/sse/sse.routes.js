import { Router } from 'express';
import authentication from '../../shared/middlewares/authentication.js';

import SseController from './sse.controller.js';

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

const sseController = new SseController();
const rootRouter = new Router();

rootRouter.get('/events', sseController.onEvent);

// rootRouter.post('/response/on_cancel', sseController.onCancel);
// rootRouter.post('/response/on_confirm', sseController.onConfirm);
// rootRouter.post('/response/on_init', sseController.onInit);

rootRouter.post('/bap/eunimart_bap/on_search', sseController.onSearch);
rootRouter.post('/bap/eunimart_bap/on_select', sseController.onSelect);
rootRouter.post('/bap/eunimart_bap/on_init', sseController.onInit);
rootRouter.post('/bap/eunimart_bap/on_confirm', sseController.onConfirm);
rootRouter.post('/bap/eunimart_bap/on_update', sseController.onUpdate);
rootRouter.post('/bap/eunimart_bap/on_cancel', sseController.onCancel);
rootRouter.post('/bap/eunimart_bap/on_status', sseController.onStatus);
rootRouter.post('/bap/eunimart_bap/on_track', sseController.onTrack);
rootRouter.post('/bap/eunimart_bap/on_support', sseController.onSupport);
rootRouter.post('/bap/eunimart_bap/rating_categories', sseController.ratingCategories);
rootRouter.post('/bap/eunimart_bap/feedback_categories', sseController.feedbackCategories);
rootRouter.post('/bap/eunimart_bap/feedback_form', sseController.feedbackForm);
rootRouter.post('/bap/eunimart_bap/on_rating', sseController.onRating);
rootRouter.post('/bap/eunimart_bap/on_issue', sseController.onBapIssue);
rootRouter.post('/bpp/eunimart_bpp/on_issue', sseController.onBppIssue);
rootRouter.post('/bpp/eunimart_bpp/on_issue_status',sseController.onIssueStatus);
rootRouter.post('/bap/eunimart_bap/on_issue_status',sseController.onIssueStatus);



// rootRouter.post('/response/on_select', sseController.onQuote);
// rootRouter.post('/response/on_status', sseController.onStatus);
// rootRouter.post('/response/on_support', sseController.onSupport);
// rootRouter.post('/response/on_track', sseController.onTrack);
// rootRouter.post('/response/on_update', sseController.onUpdate);

export default rootRouter;
