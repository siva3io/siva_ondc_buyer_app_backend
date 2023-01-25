import RatingService from './rating.service.js';
import BppRatingService from './bppRating.service.js';

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

const bppRatingService = new BppRatingService();

const ratingService = new RatingService();

class RatingController {

    /**
    * rating order
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    BapRating(req, res, next) {
        const { body: ratingRequest } = req;
        ratingService.BapRating(ratingRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * get Bap Rating Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapRatingCategories(req, res, next) {
        const { body: ratingCategoriesRequest } = req;

        ratingService.getBapRatingCategories(ratingCategoriesRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * get Bap Feedback Categories
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapFeedbackCategories(req, res, next) {
        const { body: feedbackCategoriesRequest } = req;

        ratingService.getBapFeedbackCategories(feedbackCategoriesRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }

        /**
    * get Bap Feedback Form
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getBapFeedbackForm(req, res, next) {
        const { body: feedbackFormRequest } = req;

        ratingService.getBapFeedbackForm(feedbackFormRequest).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            next(err);
        });
    }
}

export default RatingController;