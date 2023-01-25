import LspOrderModel from './lsp_order.js';
import LspBapUserCart from './lsp_bap_user_cart.js';

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

const CreateLspOrder = async (data) => {
    return await LspOrderModel.create(data);
};

const UpdateLspOrder = async (query, data) => {
    return await LspOrderModel.findOneAndUpdate(query, data);
};

const DeleteLspOrder = async (query) => {
    return await LspOrderModel.deleteOne(query);
};

const GetLspOrder = async (query) => {
    return await LspOrderModel.findOne(query).lean();
};
const ListLspOrder = async (query) => {
    return await LspOrderModel.find(query).lean();
};

const UpsertLspOrder = async (query, data) => {
    return await LspOrderModel.findOneAndUpdate(query, data, {upsert: true});
}

//========================= user cart =================================================
const UpsertLspBapUserCartOrder = async (query, data) => {
    return await LspBapUserCart.findOneAndUpdate(query, data, {upsert: true});
}
const GetLspBapUserCartOrder = async (query) => {
    return await LspBapUserCart.findOne(query).lean();
};
const ListLspBapUserCartOrder = async (query) => {
    return await LspBapUserCart.find(query).lean();
};

export {
    CreateLspOrder,
    GetLspOrder,
    UpdateLspOrder,
    DeleteLspOrder,
    ListLspOrder,
    UpsertLspOrder,

    UpsertLspBapUserCartOrder,
    GetLspBapUserCartOrder,
    ListLspBapUserCartOrder,
}