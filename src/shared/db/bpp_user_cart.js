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

const selectSchema = new mongoose.Schema(
    {
        context: { type: Object },
        message : { type: Object }
       
    },
    { _id: false }
);

const BPPUserCart = new mongoose.Schema({
    transactionId: {type: String},
    select:{type:selectSchema},
    onselect:{type:selectSchema}
},
{ _id: true, timestamps: true }
);

BPPUserCart.index({userId: 1, createdAt: -1});
BPPUserCart.plugin(mongoosePaginate)

const BPP_User_Cart = mongoose.model('bpp_user_cart', BPPUserCart, "bpp_user_cart");

export default BPP_User_Cart;