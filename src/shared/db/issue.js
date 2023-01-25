import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

const CommentSchema = new mongoose.Schema(
    {
        context: {type: String},
        description: {type: String},
        CreatedBy: {type: String}
    },
    { _id: true, timestamps: true }
)

const IssueSchema = new mongoose.Schema(
    {
        transaction_id: { type: String},
        issue_id: { type: String},
        parent_issue_id: { type: String},
        message_id: {type: String},
        issues: {type: [Object]},
        comments: {type: [CommentSchema]},
        status: {type: Object},
        buyer: { type: String},
        seller: { type: String},
        provider_name: { type: String},
        issue_category: { type: String},
        CreatedBy: { type: String},
        AssignedFrom: {type: String},
        AssignedTo: { type: String},
        level:{type:String,default:"Issue"},
        resolution_provider: {type: Object},
        resolution: {type: Object},
        on_context: {type: Object},
        createdAt: { type: Date, default: new Date()}
    },
    { _id: true, timestamps: true }
)


IssueSchema.index({userId: 1, createdAt: -1});


// const Issue = mongoose.model('issue',IssueSchema,"issues")
IssueSchema.plugin(mongoosePaginate)
const Issue = mongoose.model('issue',IssueSchema,"issues")


export default Issue;