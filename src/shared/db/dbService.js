import NoRecordFoundError from "../lib/errors/no-record-found.error.js";
import OrderMongooseModel from './order.js';
import CartMongooseModel from "./user_cart.js"
import BPPCartMongooseModel from "./bpp_user_cart.js"
import ProductMongooseModel from './product.js';
import StateMongooseModel from './state.js';
import ProviderMongooseModel from './provider.js';
import UserMongooseModel from './users.js';
import ReconciliationMongooseModel from "./reconciliation.js";
import PaymentMongooseModel from "./payments.js";
import Issue from "./issue.js";
import { UserIssueCategories, ApplicationIssueCategories, IssueCategories } from "./grievance_categories.js";
import PayoutMongooseModel from "./payout_details.js"
import { v4 as uuidv4 } from 'uuid';
import IssueTypes from "./issue_types.js";
import { CancellationReason } from "./cancellation_db.js";
import { cancellation_reason } from "./cancellation_reason.js";
import { ReturnReasons } from "./return_reason_db.js";
import { returns_reason } from "./return_reason.js";
import BapIssue from "./bap_issue.js";
import LspIssue from "./lsp_issue.js";
import BppIssue from "./bpp_issue.js";
import User  from "./user.js"
import { query } from "express";
import productCategory from "./product_category.js";
import ProductCategory from "./product_category.js";

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

let issue_categories = [
    {
        "category": "Order",
        "code": "001",
        "description": "Incorrect product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Order",
        "code": "002",
        "description": "Damaged product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Order",
        "code": "003",
        "description": "Lower quality product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Order",
        "code": "004",
        "description": "Wrong quantity or number of product(s) received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Payment",
        "code": "021",
        "description": "Amount charged for an Order is different than what was shown",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Payment",
        "code": "022",
        "description": "Refund not received for return(s) or cancellation(s)",
        "raised_by": "Buyer",
        "raised_on": "Whoever collects payment",
        "expected_response_time": "P1D",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Payment",
        "code": "023",
        "description": "Invoice not received",
        "raised_by": "Buyer or Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT48H",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Payment",
        "code": "024",
        "description": "Incorrect Invoice",
        "raised_by": "Buyer or Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT48H",
        "expected_resolution_time": "P7D"
    },
    {
        "category": "Fulfillment",
        "code": "041",
        "description": "Order not received within TAT promised",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "PT12H",
        "expected_resolution_time": "PT12H"
    },
    {
        "category": "Fulfillment",
        "code": "042",
        "description": "Torn or damaged packaging",
        "raised_by": "Buyer",
        "raised_on": "Whoever collects payment",
        "expected_response_time": "PT6H",
        "expected_resolution_time": "PT6H"
    },
    {
        "category": "Fulfillment",
        "code": "043",
        "description": "Status not updated",
        "raised_by": "Buyer or Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT3H",
        "expected_resolution_time": "PT3H"
    },
    {
        "category": "Transaction",
        "code": "081",
        "description": "Violation of transaction contracts (for mandatory attributes, values provided), also includes cases of malformed payload",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT1H",
        "expected_resolution_time": "3 days"
    },
    {
        "category": "Transaction",
        "code": "082",
        "description": "Incorrect image(s) for item(s)",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Transaction",
        "code": "083",
        "description": "Illegal item(s) shown",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT3H",
        "expected_resolution_time": "PT3H"
    },
    {
        "category": "Transaction",
        "code": "084",
        "description": "Invalid Assortment (Category mismatch vis-e-vis item searched",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "PT72H",
        "expected_resolution_time": "PT72H"
    },
    {
        "category": "Product",
        "code": "121",
        "description": "",
        "raised_by": "Affected Participant",
        "raised_on": "",
        "expected_response_time": "PT1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Product Service",
        "code": "122",
        "description": "",
        "raised_by": "Affected Participant",
        "raised_on": "",
        "expected_response_time": "PT1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Service",
        "code": "123",
        "description": "",
        "raised_by": "Affected Participant",
        "raised_on": "",
        "expected_response_time": "PT1H",
        "expected_resolution_time": "P1D"
    }
]

let issue_types = [
    {
        "level": 1,
        "data": "Issue"
    },
    {
        "level": 2,
        "data": "Grievance"
    },
    {
        "level": 3,
        "data": "Dispute"
    }
]




let UserGrievances = [

    {
        "category": "contract",
        "code": "101",
        "description": "Return terms not followed",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "contract",
        "code": "102",
        "description": "Cancellation terms not followed",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "order",
        "code": "001",
        "description": "Incorrect product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "order",
        "code": "002",
        "description": "Damaged product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "order",
        "code": "003",
        "description": "Lower quality product received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "order",
        "code": "004",
        "description": "Wrong quantity or number of product(s) received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "billing",
        "code": "021",
        "description": "Amount charged for an order is different than what was shown",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "billing",
        "code": "022",
        "description": "Refund not received for return(s) or cancellation(s)",
        "raised_by": "Buyer",
        "raised_on": "Whoever collects payment",
        "expected_response_time": "24 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "Fulfillment",
        "code": "041",
        "description": "Order not received within TAT promised",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "12 hrs",
        "expected_resolution_time": "12 hrs"
    },
    {
        "category": "Fulfillment",
        "code": "042",
        "description": "Torn or damaged packaging",
        "raised_by": "Buyer",
        "raised_on": "Whoever collects payment",
        "expected_response_time": "6 hrs",
        "expected_resolution_time": "6 hrs"
    },
    {
        "category": "billing",
        "code": "023",
        "description": "Invoice not received",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "48",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "billing",
        "code": "024",
        "description": "Incorrect Invoice",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "48 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "Fulfillment",
        "code": "043",
        "description": "Status not updated",
        "raised_by": "Buyer",
        "raised_on": "Seller App",
        "expected_response_time": "3 hrs",
        "expected_resolution_time": "3 hrs"
    },
]


let ApplicationGrievances = [
    {
        "category": "contract",
        "code": "101",
        "description": "Return terms not followed",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "contract",
        "code": "102",
        "description": "Cancellation terms not followed",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "compliance",
        "code": "081",
        "description": "Violation of transaction contracts (for mandatory attributes, values provided), also includes cases of malformed payload",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "3 days"
    },
    {
        "category": "compliance",
        "code": "082",
        "description": "Incorrect image(s) for item(s)",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "compliance",
        "code": "083",
        "description": "Illegal item(s) shown",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "3 hrs",
        "expected_resolution_time": "3 hrs"
    },
    {
        "category": "compliance",
        "code": "084",
        "description": "Invalid Assortment (Category mismatch vis-e-vis item searched",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "72 hrs",
        "expected_resolution_time": "72 hrs"
    },
    {
        "category": "operations",
        "code": "062",
        "description": "Response time not acceptable for buyer experience",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "12 hrs",
        "expected_resolution_time": "12 hrs"
    },
    {
        "category": "billing",
        "code": "023",
        "description": "Invoice not received",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "48",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "billing",
        "code": "024",
        "description": "Incorrect Invoice",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "48 hrs",
        "expected_resolution_time": "7 days"
    },
    {
        "category": "Fulfillment",
        "code": "043",
        "description": "Status not updated",
        "raised_by": "Buyer App",
        "raised_on": "Seller App",
        "expected_response_time": "3 hrs",
        "expected_resolution_time": "3 hrs"
    },
    {
        "category": "operations",
        "code": "061",
        "description": "Endpoint not accessible",
        "raised_by": "Participant",
        "raised_on": "Affected Participant",
        "expected_response_time": "3 hrs",
        "expected_resolution_time": "3 hrs"
    },
    {
        "category": "operations",
        "code": "063",
        "description": "Security Policy Violation (Injection attacks, Virus threats etc)",
        "raised_by": "Any participant",
        "raised_on": "Affected Participant",
        "expected_response_time": "2 hrs",
        "expected_resolution_time": "2 hrs"
    },
    {
        "category": "contract",
        "code": "104",
        "description": "Network agreement terms not followed",
        "raised_by": "Participant",
        "raised_on": "Participant not following terms",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "contract",
        "code": "105",
        "description": "Legal terms and conditions not followed",
        "raised_by": "Participant",
        "raised_on": "Participant not following terms",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Settlement",
        "code": "121",
        "description": "Incorrect amount settled",
        "raised_by": "Affected Participant",
        "raised_on": "Participant providing settlement data",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Settlement",
        "code": "122",
        "description": "Settlement delayed",
        "raised_by": "Affected Participant",
        "raised_on": "Participant providing settlement data",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    },
    {
        "category": "Settlement",
        "code": "123",
        "description": "Recon issue incomplete or incorrect",
        "raised_by": "Affected Participant",
        "raised_on": "Participant providing settlement data",
        "expected_response_time": "T1H",
        "expected_resolution_time": "P1D"
    }

]

let user = [
    {
        "username": "lekhh",
        "password":"abc",
        "confirm_password": "abc",
        "usertype": "buyer"

    },
    {
        "username": "Sramitha",
        "password":"srami",
        "confirm_password": "srami",
        "usertype": "buyer"

    },
    {
    "username": "Saira",
    "password":"saira",
    "confirm_password": "saria",
    "usertype": "buyer"

   },
   {
    "username": "Thanmai",
    "password":"thanu",
    "confirm_password": "thanu",
    "usertype": "buyer"

   },
   {
    "username": "Rupa",
    "password":"123",
    "confirm_password": "123",
    "usertype": "buyer"

   },
   {
    "username": "blesson",
    "password":"bless",
    "confirm_password": "bless",
    "usertype": "buyer"

   },

 {
    "username": "Drupadh",
    "password":"drups",
    "confirm_password": "dryps",
    "usertype": "buyer"

   },
   {
    "username": "Sridhar",
    "password":"sri",
    "confirm_password": "sri",
    "usertype": "buyer_admin"

   },
   {
    "username": "Praveen",
    "password":"189",
    "confirm_password": "189",
    "usertype": "buyer_admin"

   },
   {
    "username": "Harnath",
    "password":"hari",
    "confirm_password": "hari",
    "usertype": "buyer_admin"

   },
   {
    "username": "PJ",
    "password":"xyz",
    "confirm_password": "xyz",
    "usertype": "buyer_admin"

   },
   {
    "username": "kausic",
    "password":"jai",
    "confirm_password": "jai",
    "usertype": "buyer_admin"

   }
]
const seedDB = async () => {
    await IssueCategories.deleteMany({});
    await UserIssueCategories.deleteMany({});
    await ReturnReasons.deleteMany({})
    await IssueCategories.insertMany(issue_categories)
    await UserIssueCategories.insertMany(UserGrievances)
    await ApplicationIssueCategories.deleteMany({});
    await ApplicationIssueCategories.insertMany(ApplicationGrievances)
    await CancellationReason.deleteMany({});
    await CancellationReason.insertMany(cancellation_reason)
    await ReturnReasons.insertMany(returns_reason)
    try{
        await User.insertMany(user)
        }catch(err){
            if (err) {console.log(err.name)}
    
        }
}

async function FindUserGrievanceCategories() {
    return await UserIssueCategories.find({}).lean()


}

async function FindIssueCategoriesList() {
    return await IssueCategories.find({}).lean()
}

async function FindApplicationGrievanceCategories() {
    return await ApplicationIssueCategories.find({}).lean()
}

/**
* Add address
 * @param {String} createBy 
 * @param {Object} data 
 */
const addAddressById = async (createBy, data) => {
    return await UserMongooseModel.findOneAndUpdate(
        {
            id: createBy
        },
        {
            $push: { "details.address": data }
        },
        { upsert: true }
    )
};

/**
* Update address
 * @param {String} createBy 
 * @param {Object} data 
 */
const UpdateAddressById = async (createBy, payload) => {
    var data = await getUserById(createBy)
    var result = data.details?.address
    result.map((i) => {
        if (i.id === payload.id) {
            i.Name = payload.Name || i.Name
            i.address_line_1 = payload.address_line_1 || i.address_line_1
            i.address_line_2 = payload.address_line_2 || i.address_line_2
            i.address_line_3 = payload.address_line_3 || i.address_line_3
            i.phone_number = payload.phone_number || i.phone_number
            i.email = payload.email || i.email
            i.state = payload.state || i.state
            i.pincode = payload.pincode || i.pincode
            i.city = payload.city || i.city;
            return;


        }
    })
    return await UserMongooseModel.findOneAndUpdate(
        {
            id: createBy
        },
        {
            details: { address: result }
        },
        { upsert: true }
    )
};




const DeleteAddressById = async (user_id, address_id) => {
    var data = await getUserById(user_id)
    var result = data.details?.address
    var data_after_delete = result.filter(i => i.id !== address_id)
    // console.log(data_after_delete);
    return await UserMongooseModel.findOneAndUpdate(
        {
            id: user_id
        },
        {
            details: { address: data_after_delete }
        }
    )
};


/**
* Get payment
 * @param {String} UserId 
 */
const getPaymentByUserId = async (createdBy, pageNo, perPage) => {
    return await PaymentMongooseModel.paginate({ createdBy: createdBy }, Object.assign({ "lean": true, page: pageNo, limit: perPage }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            // console.log(e);
            throw new NoRecordFoundError();
        });
    // const payment = await PaymentMongooseModel.find({
    //     createdBy: createdBy
    // });

    // if (!(payment || payment.length))
    //     throw new NoRecordFoundError();
    // else
    //     return payment;
};

/**
* Get payment
 * @param {String} UserId 
 */
const getAllPayments = async (pageNo, perPage) => {
    return await PaymentMongooseModel.paginate({}, Object.assign({ "lean": true, page: pageNo, limit: perPage }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            // console.log(e);
            throw new NoRecordFoundError();
        });
    // const payment = await PaymentMongooseModel.find({
    //     createdBy: createdBy
    // });

    // if (!(payment || payment.length))
    //     throw new NoRecordFoundError();
    // else
    //     return payment;
};

const downloadPaymentByUserId = async (createdBy) => {
    const payment = await PaymentMongooseModel.find({
        createdBy: createdBy
    });

    if (!(payment || payment.length))
        throw new NoRecordFoundError();
    else
        return payment;
};

const getPaymentById = async (id) => {
    const payment = await PaymentMongooseModel.find({
        id: id
    });

    if (!(payment || payment.length))
        throw new NoRecordFoundError();
    else
        return payment?.[0];
};


const getPaymentByStatus = async (status) => {
    const payment = await PayoutMongooseModel.find({
        paymentStatus: status
    });
    if (!(payment || payment.length))
        throw new NoRecordFoundError();
    else
        return payment;
};


/**
* Update reconciliation
 * @param {String} UserId 
 */
const updatePaymentById = async (id, paymentSchema) => {
    return await PaymentMongooseModel.findOneAndUpdate(
        {
            id: id
        },
        {
            ...paymentSchema
        },
        { upsert: true }
    )
};

/**
* Get reconciliation
 * @param {String} UserId 
 */
const getReconciliationByUserId = async (createdBy, pageNo, perPage) => {

    return await ReconciliationMongooseModel.paginate({ createdBy: createdBy }, Object.assign({ "lean": true, page: pageNo, limit: perPage }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            // console.log(e);
            throw new NoRecordFoundError();
        });

    // const reconciliation = await ReconciliationMongooseModel.find({
    //     createdBy: createdBy
    // });

    // if (!(reconciliation || reconciliation.length))
    //     throw new NoRecordFoundError();
    // else
    //     return reconciliation;
};

const downloadReconciliationByUserId = async (createdBy) => {
    const reconciliation = await ReconciliationMongooseModel.find({
        createdBy: createdBy
    });

    if (!(reconciliation || reconciliation.length))
        throw new NoRecordFoundError();
    else
        return reconciliation;
};


const getReconciliationById = async (id) => {
    const reconciliation = await ReconciliationMongooseModel.find({
        id: id
    });

    if (!(reconciliation || reconciliation.length))
        throw new NoRecordFoundError();
    else
        return reconciliation?.[0];
};

/**
* Update reconciliation
 * @param {String} UserId 
 */
const updateReconciliationById = async (id, reconciliationSchema) => {
    return await ReconciliationMongooseModel.findOneAndUpdate(
        {
            id: id
        },
        {
            ...reconciliationSchema
        },
        { upsert: true }
    )
};


/**
* Get Orders
 * @param {String} transactionId 
 * @param {Object} orderSchema 
 */
const getOrderByUserId = async (createdBy, pageNo, perPage) => {
    let extra_fields={confirm:0,onConfirm:0}
    return await OrderMongooseModel.paginate({ CreatedBy: createdBy }, Object.assign({ page: pageNo,select:extra_fields, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });


    // const order = await OrderMongooseModel.find({
    //     CreatedBy: createdBy
    // }).sort({ createdAt: -1 });

    // if (!(order || order.length))
    //     throw new NoRecordFoundError();
    // else
    //     for (let i = 0; i < order.length; i++) {
    //         if (!order[i]["state"]) {
    //             order[i]["state"] = "Accepted"
    //         }
    //     }
    // return order;
};

const getAllOrders = async (pageNo, perPage) => {
    let extra_fields={confirm:0,onConfirm:0}
    return await OrderMongooseModel.paginate({}, Object.assign({ "lean": true,select:extra_fields, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
    // const order = await OrderMongooseModel.find({}).sort({createdAt: -1})
    // if (!(order || order.length))
    //     throw new NoRecordFoundError();
    // else
    //     for (let i = 0; i < order.length; i++) {
    //         if (!order[i]["state"]) {
    //             order[i]["state"] = "Accepted"
    //         }
    //     }
    // return order;
}
const ListAllOrders = async () => {

    const order = await OrderMongooseModel.find({}).sort({ createdAt: -1 })
    if (!(order || order.length))
        throw new NoRecordFoundError();
    else
        return order;
}

const downloadOrderByUserId = async (createdBy) => {
    const order = await OrderMongooseModel.find({
        CreatedBy: createdBy
    }).sort({ createdAt: -1 });

    if (!(order || order.length))
        throw new NoRecordFoundError();
    else
        for (let i = 0; i < order.length; i++) {
            if (!order[i]["state"]) {
                order[i]["state"] = "Accepted"
            }
        }
    return order;
};

/**
* update order
 * @param {String} transactionId 
 * @param {Object} orderSchema 
 */
const addOrUpdateOrderWithTransactionId = async (transactionId, orderSchema = {}) => {
    return await OrderMongooseModel.findOneAndUpdate(
        {
            transactionId: transactionId
        },
        {
            ...orderSchema
        },
        { upsert: true }
    );

};

const UpdateOrderWithTransactionId = async (transactionId, status) => {
    return await OrderMongooseModel.findOneAndUpdate(
        {
            transactionId: transactionId
        },
        {
            UpdateOrderWithTransactionId: status
        },
        { upsert: true }
    );

};

/**
 * get the order with passed transaction id from the database
 * @param {String} transactionId 
 * @returns 
 */
const getOrderByTransactionId = async (transactionId) => {
    const order = await OrderMongooseModel.find({
        transactionId: transactionId
    },{"confirm":0,"onConfirm":0}).lean();

    if (!(order || order.length))
        throw new NoRecordFoundError();
    else
        return order?.[0];
};

const getOrderById = async (orderId) => {
    const order = await OrderMongooseModel.find({
        "id": orderId
    }).lean();

    if (!(order || order.length))
        throw new NoRecordFoundError();
    else
        return order?.[0];
};

const getProductById = async (productId) => {
    const product = await ProductMongooseModel.find({
        id: productId
    }).lean();

    if (!(product || product.length))
        throw new NoRecordFoundError();
    else {
        var provider_id = product?.[0].provider_id
        var provider = await getProviderById(provider_id)
        if (!(provider || provider.length))
            throw new NoRecordFoundError();

        product[0].provider_id = provider.id

        return product?.[0];
    }
};

const getStateByStateName = async (stateName) => {
    const state = await StateMongooseModel.find({
        "name": stateName
    }).lean();

    if (!(state || state.length))
        throw new NoRecordFoundError();
    else
        return state?.[0];
};

const searchProduct = async (query) => {
    const product = await ProductMongooseModel.find(query, { _id: 0, __v: 0, createdAt: 0, created_by: 0, provider_id: 0 }).lean();
    if (!(product || product.length)) {
        throw new NoRecordFoundError
    }
    return product;
}

const getAllProviders = async (query) => {
    const providers = await ProviderMongooseModel.find().lean();
    if (!(providers || providers.length)) {
        throw new NoRecordFoundError
    }
    return providers;
}

const searchProductbyName = async (name) => {
    const product = await ProductMongooseModel.find({
        "descriptor.name": new RegExp(name, 'i')
    }).lean();
    if (!(product || product.length)) {
        throw new NoRecordFoundError();
    }
    else {
        for (let i = 0; i < product.length; i++) {
            var providerDetails = await getProviderById(product[i]["provider_id"])
            product[i]["provider_details"] = providerDetails
        }
        return product;
    }
};

const getProviderById = async (providerId) => {
    const provider = await ProviderMongooseModel.find({
        "id": providerId
    });

    if (!(provider || provider.length))
        throw new NoRecordFoundError();
    else
        return provider?.[0];
};

const createProduct = async (ProductSchema = {}) => {
    let product = await ProductMongooseModel.create(ProductSchema);
    return product;
};

const listProduct = async (pageNo, perPage) => {
    return await ProductMongooseModel.paginate({}, Object.assign({ "lean": true, page: pageNo, limit: perPage }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
}

const viewProduct = async (id) => {
    return await ProductMongooseModel.findOne(
        { "id": id }
    ).lean();
}

const UpdateProduct = async (externalId, ProductSchema = {}) => {
    return await ProductMongooseModel.findOneAndUpdate(
        {
            external_id: externalId
        },
        {
            ...ProductSchema
        }
    );
}

const getProviders = async () => {
    const providers = await ProviderMongooseModel.find();
    // console.log(providers);
    return providers
};

const getProviderByName = async (providerName) => {

    const provider = await ProviderMongooseModel.find({
        "descriptor.name": { $regex: '.*' + name + '.*' }
    });

    if (!(provider || provider.length))
        throw new NoRecordFoundError();
    else
        return provider?.[0];
};

/**
* update cart
 * @param {String} transactionId 
 * @param {Object} cart 
 */
const addOrUpdateBPPCartWithTransactionId = async (transactionId, cart = {}) => {
    return await BPPCartMongooseModel.findOneAndUpdate(
        {
            transactionId: transactionId
        },
        {
            ...cart
        },
        { upsert: true, useFindAndModify: false },
    );

};

/**
+* delete cart
+ * @param {String} transactionId 
+ * @param {Object} cart 
+ */
const deleteBPPCartWithTransactionId = async (transactionId) => {
    return await BPPCartMongooseModel.findOneAndDelete(
        {
            transactionId: transactionId
        },
    );

};


/**
* update order
 * @param {Object} UsersSchema
 */
const addOrUpdateUsers = async (UsersSchema = {}) => {


    return await UserMongooseModel.findOneAndUpdate(
        {
            details: UsersSchema
        },
        { upsert: true }
    );

};


const getBPPCartByTransactionId = async (cartId) => {
    const cart = await BPPCartMongooseModel.find({
        transactionId: cartId
    });
    if (!(cart || cart.length))
        throw new NoRecordFoundError();
    else
        return cart?.[0];
};


const getCartByTransactionId = async (cartId) => {
    const cart = await CartMongooseModel.find({
        transactionId: cartId
    });
    if (!(cart || cart.length))
        throw new NoRecordFoundError();
    else
        return cart?.[0];
};

const getUserById = async (userId) => {
    const user = await UserMongooseModel.find({
        id: userId
    });

    if (!(user || user.length))
        throw new NoRecordFoundError();
    else {
        return user?.[0];
    }
};


// const createIssue = async (IssueSchema) => {
//     return await Issue.create( IssueSchema );
// };

// // const createIssue =async (IssueSchema) => {
// //     return await IssuesModel.create( IssueSchema );
// // // }

// const FindIssue = async (message_id)=>{
//     return await Issue.find(
//         {message_id:message_id}
//     )
// }

const FindIssue = async (issue_id) => {
    return await Issue.findOne(
        { "issue_id": issue_id }
    ).lean();
}

const FindBapIssueStatus = async (issue_id) => {
    return await BapIssue.findOne(
        { "network_issue_id": issue_id }
    ).lean();
}

const FindBppIssueStatus = async (issue_id) => {
    return await BppIssue.findOne(
        { "network_issue_id": issue_id }
    ).lean();
}

const FindLspIssueStatus = async (issue_id) => {
    return await LspIssue.findOne(
        { "network_issue_id": issue_id }
    ).lean();
}

const FindBapIssue = async (issue_id) => {
    return await BapIssue.findOne(
        { "issue_id_crm_bap": issue_id }
    ).lean();
}

const FindBppIssue = async (issue_id) => {
    return await BppIssue.findOne(
        { "issue_id_crm_bpp": issue_id }
    ).lean();
}

const FindLspIssue = async (issue_id) => {
    return await LspIssue.findOne(
        { "issue_id_crm_lsp": issue_id }
    ).lean();
}
// const addToIssuesList = async (IssueSchema) => {
//     var filter = {transactionId : IssueSchema.transactionId}
//     var IssueList = await IssuesModel.findOne(filter)
//     if (!(IssueList)){        
//         var data = []
//         var issueSchema = {
//         transactionId : IssueSchema.transactionId,
//         data : data.push(IssueSchema),
//         }
//         return await createIssue(issueSchema);
//     }
//     else {
//         IssueList.data=IssueList.data.$push(IssueSchema)
//         return await IssuesModel.findOneAndUpdate(filter,IssueList)
//     }
// }

/**
* Get payment
 * @param {String} UserId 
 */
const getPayoutsByUserId = async (id, pageNo, perPage) => {
    return await PayoutMongooseModel.paginate({}, Object.assign({ "lean": true, page: pageNo, limit: perPage }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            // console.log(e);
            throw new NoRecordFoundError();
        });


    // const payout = await PayoutMongooseModel.find({})
    // return payout
    // const payment = await PaymentMongooseModel.find({
    //     createdBy: createdBy
    // });

    // if (!(payment || payment.length))
    //     throw new NoRecordFoundError();
    // else
    //     return payment;
};

const downloadPayoutsByUserId = async () => {
    const payout = await PayoutMongooseModel.find({})
    return payout
    // const payment = await PaymentMongooseModel.find({
    //     createdBy: createdBy
    // });

    // if (!(payment || payment.length))
    //     throw new NoRecordFoundError();
    // else
    //     return payment;
};

const getPayoutById = async (payoutId) => {
    const payout = await PayoutMongooseModel.find({
        id: paymentId
    });

    if (!(payout || payout.length))
        throw new NoRecordFoundError();
    else {
        return payout?.[0];
    }
};

const getPayoutByPaymentTransactionId = async (payoutId) => {
    const payout = await PayoutMongooseModel.find({
        ByPaymentTransactionId: payoutId
    });

    if (!(payout || payout.length))
        throw new NoRecordFoundError();
    else {
        return payout?.[0];
    }
};


const createPayOut = async (PayOutSchema) => {
    return await PayoutMongooseModel.create(PayOutSchema);
}




const updatePayoutByPaymentTransactionId = async (payoutId, payoutSchema) => {
    return await PayoutMongooseModel.findOneAndUpdate(
        {
            paymentTransactionId: payoutId
        },
        {
            ...payoutSchema
        }
    );
};

const updatePayoutByPaymentStatusId = async (id, payoutStatus) => {
    return await PayoutMongooseModel.updateMany(
        {
            _id: id
        },
        {
            paymentStatus: payoutStatus
        }
    );
};



// const FindIssueHistory = async (transaction_id)=>{
//     const data = await Issue.find(
//         {transaction_id:transaction_id,CreatedBy:created_by}
//     )
//     // data.col.aggregate(
//     //     [
//     //         { "$group": {
//     //             "_id": "$transaction_id",
//     //             "count": { "$sum": 1 }
//     //         }}
//     //     ],
//     //     function(err,docs) {
//     //        if (err) // console.log(err);
//     //        // console.log( docs );
//     //     }
//     // );
// }

// const FindIssueHistoryList = async ()=>{
//     return await Issue.aggregate([
//         {"$group": {_id:"$transaction_id",buyer:{$first:"$buyer"},data:{$addToSet:"$data"},buyers:{$addToSet:"$buyer"}}}
//     ])
// }

// const FindIssueList = async ()=>{
//     return await Issue.aggregate([
//         {"$group": {_id:"$message_id",data:{$addToSet:"$data"}}}
//     ])
// }

// const FindIssueList = async () => {
//     return await Issue.aggregate([
//         {"$group": {_id:"$issue_id",transaction_id:{$first: "$transaction_id"},buyer:{$first:"$buyer"},seller:{$last: "$seller"},provider_name:{$last: "$provider_name"},issue_category:{$first: "$issue_category"},data:{$addToSet:"$data"}}}
//     ])
// }



// const FindIssueHistory = async (transaction_id)=>{
//     const data = await Issue.find(
//         {transaction_id:transaction_id,CreatedBy:created_by}
//     )
//     // data.col.aggregate(
//     //     [
//     //         { "$group": {
//     //             "_id": "$transaction_id",
//     //             "count": { "$sum": 1 }
//     //         }}
//     //     ],
//     //     function(err,docs) {
//     //        if (err) // console.log(err);
//     //        // console.log( docs );
//     //     }
//     // );
// }

// const FindIssueHistoryList = async ()=>{
//     return await Issue.aggregate([
//         {"$group": {_id:"$transaction_id",buyer:{$first:"$buyer"},data:{$addToSet:"$data"},buyers:{$addToSet:"$buyer"}}}
//     ])
// }

// const FindIssueList = async ()=>{
//     return await Issue.aggregate([
//         {"$group": {_id:"$message_id",data:{$addToSet:"$data"}}}
//     ])
// }

// const FindIssueList = async () => {
//     return await Issue.aggregate([
//         {"$group": {_id:"$issue_id",transaction_id:{$first: "$transaction_id"},buyer:{$first:"$buyer"},seller:{$last: "$seller"},provider_name:{$last: "$provider_name"},issue_category:{$first: "$issue_category"},data:{$addToSet:"$data"}}}
//     ])
// }

const UpsertBapIssue = async (body) => {
    // cosn
    //TODO:: change it from issue instead from message
    let issue_type = body?.message?.issue?.issue_type
    let issue = body?.message?.issue || {}
    issue.issue_type = issue_type
    let network_issue_id = issue?.id
    let status = issue?.status
    let complainant_info = issue?.complainant_info
    //TODO: remove check
    let issue_id_crm_bap = body?.message?.issue?.issue_id_crm_bap
    let context = issue?.order?.context
    let parent_issue_id = body?.parent_issue_id
    // let description = issue?.description
    let transactionId = issue?.order?.transactionId
    let created_by = body?.CreatedBy
    let assigned_from = body?.AssignedFrom
    let assigned_to = body?.AssignedTo
    let buyer = context?.bap_uri
    let seller = context?.bpp_uri
    let provider_name = context?.bpp_uri
    let issue_category = issue?.category
    
    let comment = {
        description: issue?.description?.long_desc || '',
        CreatedBy: complainant_info?.contact?.name
    }

    if (issue_id_crm_bap) {
        let old_issue_data = await BapIssue.findOne(
            { "issue_id_crm_bap": issue_id_crm_bap }
        )
        let issue_object = old_issue_data?.issue
        let issue_input
        if (issue !== undefined)
            issue_input = Object.assign(issue_object || {}, issue)
        let status = issue_input?.status
        // var x={...issue_object,description:description}
        // if (description){
        //     issue_object.description=description
        // }
        return await BapIssue.findOneAndUpdate(
            { "issue_id_crm_bap": issue_id_crm_bap },
            { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "context": context, "status": status }
        )
    } else {

        if (network_issue_id) {
            // console.log("ENtered network if")
            if (assigned_to) {
                // console.log("Entered assigned to if ")
                return await BapIssue.create(
                    { "network_issue_id": network_issue_id, "issue_status_history": [status], "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
                )
            }
            else {
                // console.log("Entered assigned to else")
                // = await BapIssue.findOneAndUpdate(
                //     {"issue_id_crm_bap":issue_id_crm_bap},
                //     {$push: {"issue_status_history":status, "comments":comment},"issue": {...issue_object,description:description},"status":status,"resolution":resolution,"resolution_provider":resolution_provider}
                //     )
                let old_issue_data = await BapIssue.findOne(
                    { "network_issue_id": network_issue_id, "AssignedTo": undefined }
                )
                let issue_object = old_issue_data?.issue
                let issue_input = Object.assign(issue_object || {}, issue)
                let status = issue_input?.status
                let updatedData = await BapIssue.findOneAndUpdate(
                    { "network_issue_id": network_issue_id, "AssignedTo": undefined },
                    { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "context": context, "status": status }
                )
                if (updatedData != null) {
                    // console.log("Entered else if update")
                    return updatedData
                }
                else {
                    // console.log("Entered else else create")
                    return await BapIssue.create(
                        { "network_issue_id": network_issue_id, "issue_status_history": [status], "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
                    )
                }
            }
        }
        else {
            // console.log("ENtered network else")
            return await BapIssue.create(
                { "parent_issue_id": parent_issue_id, "issue_status_history": [status], "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
            )
        }
    }
}

const UpsertBppIssue = async (body) => {
    let issue_type = body?.message?.issue?.issue_type
    let issue = body?.message?.issue || {}
    issue.issue_type = issue_type
    let network_issue_id = issue?.id
    let status = issue?.status
    let issue_id_crm_bpp = body?.message?.issue?.issue_id_crm_bpp
    let context = issue?.order?.context
    let parent_issue_id = body?.parent_issue_id
    let complainant_info = issue?.complainant_info
    let comment = {
        description: issue?.description?.long_desc || '',
        CreatedBy: complainant_info?.contact?.name
    }
    if (issue_id_crm_bpp) {
        let old_issue_data = await BppIssue.findOne(
            { "issue_id_crm_bpp": issue_id_crm_bpp }
        )
        let issue_object = old_issue_data?.issue
        let issue_input = Object.assign(issue_object || {}, issue)
        let status = issue_input?.status
        return await BppIssue.findOneAndUpdate(
            { "issue_id_crm_bpp": issue_id_crm_bpp },
            { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "context": context, "status": status }
        )
    } else {
        const transactionId = issue?.order?.transactionId
        const created_by = body?.CreatedBy
        const assigned_from = body?.AssignedFrom
        const assigned_to = body?.AssignedTo
        const buyer = context?.bap_uri
        const seller = context?.bpp_uri
        const provider_name = context?.bpp_uri
        const issue_category = issue?.category
        // const issue_type = issue?.message?.issue?.issue_type
        if (network_issue_id) {
            // console.log("ENtered networsid if")
            if (assigned_to) {
                // console.log("Entered assined to if ")
                return await BppIssue.create(
                    { "network_issue_id": network_issue_id, "issue_status_history": [status], "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
                )
            }
            else {
                // console.log("Entered assined to else ")
                let old_issue_data = await BppIssue.findOne(
                    { "network_issue_id": network_issue_id, "AssignedTo": undefined }
                )

                let issue_object = old_issue_data?.issue
                // console.log(old_issue_data,issue_object,issue)
                let issue_input = Object.assign(issue_object || {}, issue)
                let status = issue_input?.status
                let updatedData = await BppIssue.findOneAndUpdate(
                    { "network_issue_id": network_issue_id, "AssignedTo": undefined },
                    { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "context": context, "status": status }
                )
                if (updatedData != null) {
                    // console.log("ENtered else if update")
                    return updatedData
                }
                else {
                    // console.log("ENtered else else create")
                    return await BppIssue.create(
                        { "network_issue_id": network_issue_id, "issue_status_history": [status], "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
                    )
                }
            }
        }
        else {
            // console.log("ENtered networsid else")
            return await BppIssue.create(
                { "parent_issue_id": parent_issue_id, "issue_status_history": [status], "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [comment], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
            )
        }
    }
}


const UpsertLspIssue = async (body) => {
    let issue_type = body?.message?.issue_type
    let issue = body?.message?.issue
    issue.issue_type = issue_type
    const network_issue_id = issue?.id
    const status = issue?.status
    const issue_id_crm_lsp = body?.message?.issue_id_crm_lsp
    const context = body?.context
    // // console.log(body.message)
    // if (!(status))
    //     status = issue?.message?.issue_resolution_details?.issue?.status
    if (issue_id_crm_lsp) {
        return await LspIssue.findOneAndUpdate(
            { "network_issue_id": network_issue_id, "issue_id_crm_lsp": issue_id_crm_lsp },
            { $push: { "issue_status_history": status }, "issue": issue }
        )
    } else {
        const transactionId = issue?.order?.transactionId
        const created_by = body?.message?.CreatedBy
        const assigned_from = body?.assigned_from
        const parent_issue_id = body?.parent_issue_id
        const assigned_to = body?.assigned_to
        const buyer = context?.bap_uri
        const seller = context?.bpp_uri
        const provider_name = context?.bpp_uri
        const issue_category = issue?.category
        // const issue_type = issue?.message?.issue?.issue_type
        if (network_issue_id)
            return await LspIssue.create(
                { "network_issue_id": network_issue_id, "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
            )
        else
            return await LspIssue.create(
                { "parent_issue_id": parent_issue_id, "transactionId": transactionId, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issue": issue, "comments": [], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "AssignedFrom": assigned_from, "context": context }
            )
    }
}

const UpsertOnBapIssue = async (body) => {
    const message = body?.message
    const issue_resolution_details = message?.issue_resolution_details
    const issue_data = issue_resolution_details?.issue
    // let description=issue_data?.description
    //TODO: remove check
    const issue_id_crm_bap = body?.message?.issue_id_crm_bap
    const network_issue_id = issue_data?.id
    // const issue = body
    const status = issue_data?.status
    const resolution = issue_resolution_details?.resolution
    const resolution_provider = issue_resolution_details?.resolution_provider
    // console.log("Inside upsert on bap---->",resolution_provider)
    let comment = {
        description: issue_data?.description?.long_desc || '',
        CreatedBy: resolution_provider?.respondent_info?.organization?.contact?.name
    }

    // switch(body?.context?.bap_uri)
    // {
    //     case process.env.BAP_URL:{
    //     comment.CreatedBy = "BPP_ADMIN"
    // }
    // case process.env.BPP_URL:{
    //     comment.CreatedBy = "BAP_ADMIN"
    // }
    // }

    // const context = body?.context
    // if (!(status))
    //     status = message?.issue_resolution_details?.issue?.status

    if (network_issue_id) {
        let old_issue_data = await BapIssue.findOne(
            { "network_issue_id": network_issue_id, "AssignedTo": undefined }
        )
        let issue_object = old_issue_data?.issue
        let issue_input = Object.assign(issue_object, issue_data)
        return await BapIssue.findOneAndUpdate(
            { "network_issue_id": network_issue_id, "AssignedTo": undefined },
            { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "status": status, "resolution": resolution, "resolution_provider": resolution_provider }
        )
    }
    else {
        console.log("Specified issue id bap -------> ", network_issue_id, " <--------- not found")
    }
}

const UpsertOnBppIssue = async (body) => {
    const message = body?.message
    // console.log("body-------->",body)
    // let orderData = body?.message?.issue?.order
    const issue_resolution_details = message?.issue_resolution_details
    const issue_data = issue_resolution_details?.issue
    const issue_id_crm_bpp = body?.message?.issue_id_crm_bpp
    const network_issue_id = issue_data?.id
    // const issue = body
    const status = issue_data?.status
    const resolution = issue_resolution_details?.resolution
    const resolution_provider = issue_resolution_details?.resolution_provider
    let comment = {
        description: issue_data?.description?.long_desc || '',
        CreatedBy: resolution_provider?.respondent_info?.organization?.contact?.name
    }
    // console.log("coment",comment)
    // switch(body?.context?.bap_uri)
    // {
    //     case process.env.BAP_URL:{
    //     comment.CreatedBy = "BPP_ADMIN"
    // }
    // case process.env.BPP_URL:{
    //     comment.CreatedBy = "BAP_ADMIN"
    // }
    // }
    // const context = body?.context
    // if (!(status))
    //     status = message?.issue_resolution_details?.issue?.status
    if (network_issue_id) {
        let old_issue_data = await BppIssue.findOne(
            { "network_issue_id": network_issue_id, "AssignedTo": undefined }
        )
        let issue_object = old_issue_data?.issue
        let issue_input = Object.assign(issue_object, issue_data)
        return await BppIssue.findOneAndUpdate(
            { "network_issue_id": network_issue_id, "AssignedTo": undefined },
            { $push: { "issue_status_history": status, "comments": comment }, "issue": issue_input, "status": status, "resolution": resolution, "resolution_provider": resolution_provider }
        )
    }
    else {
        console.log("Specified issue id bpp -------> ", network_issue_id, " <--------- not found")
    }
}

const UpsertOnLspIssue = async (body) => {
    const message = body?.message
    const issue_resolution_details = message?.issue_resolution_details
    const issue_data = issue_resolution_details?.issue
    // const issue_id_crm_lsp = message?.issue_id_crm_lsp
    const network_issue_id = issue_data?.id
    // const issue = body
    const status = issue_data?.status
    const resolution = issue_resolution_details?.resolution
    const resolution_provider = issue_resolution_details?.resolution_provider
    const context = body?.context
    // if (!(status))
    //     status = message?.issue_resolution_details?.issue?.status
    if (network_issue_id) {
        return await BapIssue.findOneAndUpdate(
            { "network_issue_id": network_issue_id },
            { $push: { "issue_status_history": status }, "issue": issue_data, "status": status, "resolution": resolution, "resolution_provider": resolution_provider, "on_context": context }
        )
    }
    else {
        console.log("Specified issue id lsp -------> ", network_issue_id, " <--------- not found")
    }
}

const UpsertIssue = async (body) => {
    const issue_id = body?.message?.issue?.id
    const issue = body
    const status = issue?.message?.issue?.status
    // // console.log(body.message)
    // if (!(status))
    //     status = issue?.message?.issue_resolution_details?.issue?.status
    if (issue_id) {
        return await Issue.findOneAndUpdate(
            { "issue_id": issue_id },
            { $push: { "issues": issue }, "status": status }
        )
    } else {
        const created_by = body?.message?.CreatedBy
        const assigned_from = body?.assigned_from
        const parent_issue_id = body?.parent_issue_id
        const assigned_to = body?.assigned_to
        const transaction_id = issue?.context?.transaction_id
        const buyer = issue?.context?.bap_uri
        const seller = issue?.context?.bpp_uri
        const provider_name = issue?.context?.bpp_uri
        const issue_category = issue?.message?.issue?.category
        const issue_type = issue?.message?.issue?.issue_type
        return await Issue.create(
            { "issue_id": uuidv4(), "parent_issue_id": parent_issue_id, "transaction_id": transaction_id, "buyer": buyer, "seller": seller, "provider_name": provider_name, "issue_category": issue_category, "issues": [issue], "comments": [], "status": status, "AssignedTo": assigned_to, "CreatedBy": created_by, "level": issue_type, "AssignedFrom": assigned_from }
        )
    }
}

const UpsertOnIssue = async (body) => {
    const message = body?.message
    const issue_resolution_details = message?.issue_resolution_details
    const issue_data = issue_resolution_details?.issue
    const issue_id = issue_data?.id
    const issue = body
    const status = issue?.status
    const resolution = issue_resolution_details?.resolution
    const resolution_provider = issue_resolution_details?.resolution_provider
    const context = body?.context
    // if (!(status))
    //     status = message?.issue_resolution_details?.issue?.status
    if (issue_id) {
        return await Issue.findOneAndUpdate(
            { "issue_id": issue_id },
            { $push: { "issues": issue }, "status": status, "resolution": resolution, "resolution_provider": resolution_provider, "on_context": context }
        )
    }
    else {
        console.log("Specified issue id -------> ", issue_id, " <--------- not found")
    }
}

const UpdateIssue = async (body) => {
    const issue_id = body.issue_id
    const comment = body.comment
    const status = body.status
    const username = body.username
    return await Issue.findOneAndUpdate(
        { "network_issue_id": issue_id },
        { $push: { "comments": comment }, "status": status, "CreatedBy": username }
    )
}

const UpdateBapIssue = async (body) => {
    const issue_id = body.issue_id
    const comment = body.comment
    const status = body.status
    const created_by = body.CreatedBy
    const issue = body.issue
    return await BapIssue.findOneAndUpdate(
        { "issue_id_crm_bap": issue_id },
        { $push: { "comments": comment }, "status": status, "CreatedBy": created_by, "issue": issue }
    )
}

const UpdateBppIssue = async (body) => {
    const issue_id = body.issue_id
    const comment = body.comment
    const status = body.status
    const created_by = body.CreatedBy
    const issue = body.issue
    return await BppIssue.findOneAndUpdate(
        { "issue_id_crm_bpp": issue_id },
        { $push: { "comments": comment }, "status": status, "CreatedBy": created_by, "issue": issue }
    )
}

const UpdateLspIssue = async (body) => {
    const issue_id = body.issue_id
    const comment = body.comment
    const status = body.status
    const created_by = body.CreatedBy
    const issue = body.issue
    return await LspIssue.findOneAndUpdate(
        { "issue_id_crm_bap": issue_id },
        { $push: { "comments": comment }, "status": status, "CreatedBy": created_by, "issue": issue }
    )
}

const IssuesList = async () => {
    return await IssueTypes.find({}).lean();
}

const ListLspIssue = async (filters, pageNo, perPage) => {
    var conditions = {}
    // var default_conditions =
    // if(filters.AssignedTo){
    //     conditions.AssignedTo=filters.AssignedTo
    // }
    // if(filters.CreatedBy){
    //     conditions.CreatedBy=filters.CreatedBy
    // }
    if (filters.status) {
        var x = "status.status"
        conditions[x] = filters.status
    }
    if (filters.level) {
        var x = "issue.issue_type"
        conditions[x] = filters.level
    }
    return await LspIssue.paginate({ $and: [{ $or: [{ "AssignedTo": filters.AssignedTo }, { "CreatedBy": filters.CreatedBy }] }, conditions] }, Object.assign({ "lean": true, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
}

const ListBppIssue = async (filters, pageNo, perPage) => {
    var conditions = {}
    // var default_conditions =
    // if(filters.AssignedTo){
    //     conditions.AssignedTo=filters.AssignedTo
    // }
    // if(filters.CreatedBy){
    //     conditions.CreatedBy=filters.CreatedBy
    // }
    if (filters.status) {
        var x = "status.status"
        conditions[x] = filters.status
    }
    if (filters.level) {
        var x = "issue.issue_type"
        conditions[x] = filters.level
    }
    if (filters.network_issue_id) {
        var x = "network_issue_id"
        var pattern = filters.network_issue_id
        conditions[x] = new RegExp(pattern, "i")
        // console.log("cndio",conditions[x])
    }
    let filterForUser = { $and: [{ $or: [{ "AssignedTo": filters.AssignedTo }, { "CreatedBy": filters.CreatedBy }] }, conditions] }
    if (filters.user_type == "BPP_ADMIN") {
        filterForUser = { ...conditions }
    }
    return await BppIssue.paginate(filterForUser, Object.assign({ "lean": true, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
}


const ListBapIssue = async (filters, pageNo, perPage) => {
    var conditions = {}
    // var default_conditions =
    // if(filters.AssignedTo){
    //     conditions.AssignedTo=filters.AssignedTo
    // }
    // if(filters.CreatedBy){
    //     conditions.CreatedBy=filters.CreatedBy
    // }
    if (filters.status) {
        var x = "status.status"
        conditions[x] = filters.status
    }
    if (filters.level) {
        var x = "issue.issue_type"
        conditions[x] = filters.level
    }
    if (filters.network_issue_id) {
        var x = "network_issue_id"
        var pattern = filters.network_issue_id
        conditions[x] = new RegExp(pattern, "i")
        // console.log("cndio",conditions[x])
    }
    let filterForUser = { $and: [{ $or: [{ "AssignedTo": filters.AssignedTo }, { "CreatedBy": filters.CreatedBy }] }, conditions] }
    // console.log(filterForUser)
    if (filters.user_type == "BAP_ADMIN") {
        filterForUser = { ...conditions }
    }
    return await BapIssue.paginate(filterForUser, Object.assign({ "lean": true, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
}

const ListIssue = async (filters, pageNo, perPage) => {
    var conditions = {}
    // var default_conditions =
    // if(filters.AssignedTo){
    //     conditions.AssignedTo=filters.AssignedTo
    // }
    // if(filters.CreatedBy){
    //     conditions.CreatedBy=filters.CreatedBy
    // }
    if (filters.status) {
        var x = "issue.status.status"
        conditions[x] = filters.status
    }
    if (filters.level) {
        var x = "issue.issue_type"
        conditions[x] = filters.level
    }
    return await Issue.paginate({ $and: [{ $or: [{ "AssignedTo": filters.AssignedTo }, { "CreatedBy": filters.CreatedBy }] }, conditions] }, Object.assign({ "lean": true, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {};
            object["data"] = response.docs;
            object["pagination"] = {};
            object["pagination"]["per_page"] = perPage;
            object["pagination"]["page_no"] = pageNo;
            object["pagination"]["total_rows"] = response.totalDocs;
            object["pagination"]["total_pages"] = Math.ceil(response.totalDocs / perPage);
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
}
const addOrUpdateProductsWithSkuId = async (ProductSchema = {}) => {
    return await ProductMongooseModel.findOneAndUpdate(
        {
            id: ProductSchema.id
        },
        {
            ...ProductSchema
        },
        { upsert: true },
    );

};

const cancellation = async () => {
    const cancellation = await CancellationReason.find({});

    if (!(cancellation || cancellation.length))
        throw new NoRecordFoundError();
    else {
        return cancellation;
    }
};

const retention = async () => {
    const returns = await ReturnReasons.find({});

    if (!(returns || returns.length))
        throw new NoRecordFoundError();
    else {
        return returns;
    }
};

const CreateBppIssue = async (body) => {
    return await BppIssue.create(body)
}

const CreateBapIssue = async (body) => {
    return await BapIssue.create(body)
}


const UpsertBapUserCartItem = async (query, data = {}) => {
    return await CartMongooseModel.findOneAndUpdate(query, data, { upsert: true });
}
const GetBapUserCartItem = async (query) => {
    return await CartMongooseModel.findOne(query).lean();
};
const DeleteBapUserCartItem = async (query) => {
    return await CartMongooseModel.deleteOne(query);
};
const ListBapUserCartItems = async (query, pageNo, perPage) => {
    return await CartMongooseModel.paginate(query, Object.assign({ "lean": true, page: pageNo, limit: perPage, sort: { createdAt: -1 } }), {})
        .then((response) => {
            let object = {
                pagination: {
                    page_no: pageNo,
                    per_page: perPage,
                    total_rows: response.totalDocs,
                    total_pages: Math.ceil(response.totalDocs / perPage),
                },
                data: response.docs
            };
            return object;
        })
        .catch((e) => {
            throw new NoRecordFoundError();
        });
};

const createUser = async (UserSchema) =>{
    try{
        let user = await User.create(UserSchema);
        return user;
    }
    catch(error){
        console.error(error)
        throw error;
    }
    
}

const getUser = async (query)=>{
    try{
        let user =await User.findOne(query)
        return user
    }
    catch(error){
        console.error(error)
        throw error;
    }
}

const updateUser= async (query, data)=>{
    try{
        let user=await User.findOneAndUpdate(query, data)
    }
    catch(error){
        console.error(error)
        throw error;
    }
}

// const validationUser = async (_id, UserSchema={}) => {
//     if UserSchema.pas

// }


const SearchProductCategory = async (name) => {
    // const product = await productCategory.find(query, { _id: 0, __v: 0, createdAt: 0, created_by: 0, provider_id: 0 }).lean();
    const product = await ProductCategory.find({
        "name": new RegExp(name,'i')
    }).lean()
    if (!(product || product.length)) {
        throw new NoRecordFoundError
    }
    return product;
}


export {
    addOrUpdateOrderWithTransactionId,
    getOrderByTransactionId,

    addOrUpdateUsers,
    getOrderById,
    getUserById,

    getProductById,
    getProviderById,
    searchProductbyName,
    getProviderByName,
    getAllProviders,
    createProduct,
    UpdateProduct,
    getProviders,
    addAddressById,
    getOrderByUserId,
    downloadOrderByUserId,
    UpdateAddressById,
    getReconciliationByUserId,
    downloadReconciliationByUserId,
    updateReconciliationById,
    getReconciliationById,
    seedDB,
    // FindGrievanceCategories,
    ListIssue,
    UpdateIssue,
    UpsertIssue,
    // createIssue,
    // FindIssue,
    // FindIssueHistoryList,
    // FindIssueList,
    FindIssue,
    // FindIssueHistory,
    getPaymentById,
    getPaymentByUserId,
    downloadPaymentByUserId,
    updatePaymentById,
    createPayOut,
    getPayoutsByUserId,
    downloadPayoutsByUserId,
    getPayoutById,
    listProduct,
    viewProduct,
    updatePayoutByPaymentTransactionId,
    getPaymentByStatus,
    updatePayoutByPaymentStatusId,
    UpdateOrderWithTransactionId,
    getPayoutByPaymentTransactionId,
    DeleteAddressById,
    IssuesList,
    FindUserGrievanceCategories,
    FindApplicationGrievanceCategories,
    getAllOrders,
    getAllPayments,
    searchProduct,
    UpsertOnIssue,
    addOrUpdateProductsWithSkuId,
    cancellation,
    retention,
    ListBapIssue,
    ListBppIssue,
    ListLspIssue,
    UpsertBapIssue,
    UpsertBppIssue,
    UpsertLspIssue,
    FindBapIssue,
    FindBppIssue,
    FindLspIssue,
    UpdateBapIssue,
    UpdateBppIssue,
    UpdateLspIssue,
    UpsertOnBapIssue,
    UpsertOnBppIssue,
    UpsertOnLspIssue,
    CreateBppIssue,
    CreateBapIssue,
    FindBapIssueStatus,
    FindBppIssueStatus,
    FindLspIssueStatus,
    FindIssueCategoriesList,
    addOrUpdateBPPCartWithTransactionId,
    deleteBPPCartWithTransactionId,
    getBPPCartByTransactionId,
    ListAllOrders,

    //=========cart services==================================== 
    UpsertBapUserCartItem,
    GetBapUserCartItem,
    DeleteBapUserCartItem,
    ListBapUserCartItems,
    getCartByTransactionId,
    getStateByStateName,
    createUser,
    getUser,
    updateUser,
    SearchProductCategory,
}
