import mongoose from "mongoose";

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

const UserIssueCategoriesSchema = new mongoose.Schema(
    {
        category: { type: String },
        code: { type: String },
        description: { type: String },
        raised_by: { type: String },
        raised_on: { type: String },
        expected_response_time: { type: String },
        expected_resolution_time: { type: String }
       
    },
    { _id: true, timestamps: true }
);


const ApplicationIssueCategoriesSchema = new mongoose.Schema(
    {
        category: { type: String },
        code: { type: String },
        description: { type: String },
        raised_by: { type: String },
        raised_on: { type: String },
        expected_response_time: { type: String },
        expected_resolution_time: { type: String }
       
    },
    { _id: true, timestamps: true }
);

const IssueCategoriesSchema = new mongoose.Schema(
    {
        category: { type: String },
        code: { type: String },
        description: { type: String },
        raised_by: { type: String },
        raised_on: { type: String },
        expected_response_time: { type: String },
        expected_resolution_time: { type: String }
       
    },
    { _id: true, timestamps: true }
);

IssueCategoriesSchema.index({category: 1 });
UserIssueCategoriesSchema.index({category: 1 });
ApplicationIssueCategoriesSchema.index({category: 1 });

const IssueCategories = mongoose.model('IssueCategories', IssueCategoriesSchema, "IssueCategories");

 const UserIssueCategories = mongoose.model('UserIssueCategories', UserIssueCategoriesSchema, "UserIssueCategories");

 const ApplicationIssueCategories= mongoose.model('ApplicationIssueCategories', ApplicationIssueCategoriesSchema, "ApplicationIssueCategories");

export  {UserIssueCategories,ApplicationIssueCategories,IssueCategories};

