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

const UserCart = new mongoose.Schema({
    itemId : {type: String},
    transactionId: {type: String},
    order: {type: Object},
    context:{type:Object},
    select:{type:selectSchema},
    onselect:{type:selectSchema},
    CreatedBy: {type: String}
},
{ _id: true, timestamps: true }
);

UserCart.index({userId: 1, createdAt: -1});
UserCart.plugin(mongoosePaginate)

const User_Cart = mongoose.model('user_cart', UserCart, "user_cart");

export default User_Cart;