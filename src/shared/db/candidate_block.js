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

const CandidateBlockSchema = new mongoose.Schema(
    {
        id: { type: String },
        index: { type: Number },
        transaction_id: { type: String },
        timestamp: { type: String },
        data: { type: String },
        hash: { type: String },
        prev_hash: { type: String },
        validator: { type: String },
        candidate_timestamp: { type: String }, 
        temp_timestamp: { type: String },
    },
    { _id: true, timestamps: true }
);

CandidateBlockSchema.index({userId: 1, createdAt: -1});

const CandidateBlock = mongoose.model('candidate_block', CandidateBlockSchema, "candidate_block");

export default CandidateBlock;
