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

const lspselectSchema = new mongoose.Schema(
    {
        context: { type: Object },
        message : { type: Object }
       
    },
    { _id: false }
);

const lspMsnSchema = new mongoose.Schema(
    {
        fulfillment_id : { type: String},
        item_ids : { type: [String]},
        location_id : { type: String},
        location : { type: Object},
        preferences : { type: Object },
        lsp_response :{
            best_lsp_provider: { type: Object },
            mapping_details : { type: Object},
        },
    },
    { _id: false }
);

const LspBapUserCart = new mongoose.Schema({
        parent_transaction_id : { type : String},
        transaction_id: {type: String},
        search : { type : Object },
        on_search:{type:lspselectSchema},
        msn_lsp_on_search_response : {type: lspMsnSchema},
        CreatedBy: {type: String},
        context:{type:Object},
    },
    { _id: true, timestamps: true }
);

LspBapUserCart.index({userId: 1, createdAt: -1});
LspBapUserCart.plugin(mongoosePaginate)

const Lsp_bap_user_cart = mongoose.model('lsp_bap_user_cart', LspBapUserCart, "lsp_bap_user_cart");

export default Lsp_bap_user_cart;