import ApplicationService from "./application.service.js";
import { razorClient } from "../../../shared/intigrations/razor_pay/razorPayConnector.js";
// const _sodium = require('libsodium-wrappers');
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import * as _sodium from "libsodium-wrappers";
import Excel from "exceljs";
import { CITY_CODE } from "../../../shared/utils/cityCode.js";
import {
  getProviders,
  addAddressById,
  getUserById,
  getOrderByUserId,
  getReconciliationByUserId,
  downloadReconciliationByUserId,
  updateReconciliationById,
  getReconciliationById,
  getPayoutsByUserId,
  downloadPayoutsByUserId,
  createPayOut,
  getOrderByTransactionId,
  getProductById,
  UpdateAddressById,
  DeleteAddressById,
  getAllOrders,
  getCartByTransactionId,
  cancellation,
  retention,
  ListAllOrders,
  UpsertBapUserCartItem,
  DeleteBapUserCartItem,
  ListBapUserCartItems,
  SearchProductCategory
} from "../../../shared/db/dbService.js";
import { BAPApiCall } from "../../../shared/utils/protocolApis/index.js";
import JsonWebToken from "../../../shared/lib/authentication/json-web-token.js";
import ConvertJsonToCsv from "../../../shared/utils/csvUtil.js";
import upload from "../../../shared/utils/upload_to_s3.js";

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

const applicationService = new ApplicationService();
const jsonWebToken = new JsonWebToken();


class ApplicationController {
  /**
   * Cities
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  Cities(req, res, next) {
    var response = {};
    if (CITY_CODE) {
      response["status"] = true;
      response["data"] = CITY_CODE;
    } else {
      response["status"] = false;
    }

    res.json(response);
  }

  /**
   * Stores
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async Stores(req, res, next) {
    var response = {};
    response["status"] = true;
    response["data"] = await getProviders();
    res.json(response);
  }

  /**
   * Add address
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async AddAddress(req, res, next) {
    const { body: request, params } = req;
    const { id } = params;
    request["id"] = uuidv4();
    var response = await addAddressById(id, request);
    res.json({ status: true, message: "Address updated" });
  }

  /**
   * Delete address
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async DeleteAddress(req, res, next) {
    const { params } = req;

    const { id, address_id } = params;
    
    var response = await DeleteAddressById(id, address_id);
    res.json({ status: true, message: "Address Deleted" });
  }

  /**
   * Update address
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async UpdateAddress(req, res, next) {
    const { body: request, params } = req;
    const { id } = params;
    var response = await UpdateAddressById(id, request);
    res.json({ status: true, message: "Address updated" });
  }

  /**
   * address
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetAddress(req, res, next) {
    const { params } = req;
    const { id } = params;
    const userInformation = await getUserById(id);
    var response = {};
    response["status"] = true;
    response["data"] = userInformation?.details?.address;
    res.json(response);
  }

  /**
   * orders
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetOrders(req, res, next) {
    const { params, query } = req;
    let pageNo = Number(query?.page_no) || 1;
    let perPage = Number(query?.per_page) || 10;
    const { id } = params;
    let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
    let user_id =decoded?.ID  || 1
    
    const orders = await getOrderByUserId(user_id, pageNo, perPage);
    var response = {};
    response["status"] = true;
    response["data"] = orders.data;
    response["pagination"] = orders.pagination;
    res.json(response);
  }

  /**
   * orders
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetAllOrders(req, res, next) {
    const { query } = req;
    let pageNo = Number(query?.page_no) || 1;
    let perPage = Number(query?.per_page) || 10;
    const orders = await getAllOrders(pageNo, perPage);

    //for frontend listing
    orders.data.map(order => {
      order['item'] = order?.items?.[0] || {}
      return order
    })

    var response = {};
    response["status"] = true;
    response["data"] = orders.data;
    response["pagination"] = orders.pagination;
    res.json(response);
  }

  async getOrderByTransactionId(req, res, next) {
    const { query } = req;
    const { id } = query;
    var orderDetails = await getOrderByTransactionId(id);
    var response = {};
    response["status"] = true;
    response["data"] = orderDetails;
    res.json(response);
  }

  //Kausic to write
  async getBPPOrderByTransactionId(req, res, next) {
    try {
      let authorization = req.headers.authorization;
      let transactionId = req.query.id;

      let request = {
        baseURL: process.env.EUNIMART_CORE_HOST,
        url: "/api/v1/sales_orders/list/dropdown",
        method: "GET",
        headers: {
          Authorization: authorization,
        },
        params: {
          filters: '[["reference_number","=","' + transactionId + '"]]',
        },
      };
      let response = await axios(request);
      let apiResponse = {
        meta: response.data.meta,
        data: response.data?.data[0] || null,
      };

      delete apiResponse.meta.info;
      return res.json(apiResponse);
    } catch (err) {
      console.log("Error ========>>> ", err);
      next(err);
    }
  }
  /**
   * orders
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async DownloadOrders(req, res, next) {
    const { params } = req;
    const { id } = params;
    const orders = await getOrderByUserId(id);

    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet("Orders");
    worksheet.columns = [
      { header: "_id", key: "_id" },
      { header: "transactionId", key: "transactionId" },
      { header: "addOns", key: "addOns" },
      { header: "bapId", key: "bapId" },
      { header: "bppId", key: "bppId" },
      { header: "cancellation_reason", key: "cancellation_reason" },
      { header: "cancellation_remark", key: "cancellation_remark" },
      { header: "cancelled_at", key: "cancelled_at" },
      { header: "cancelled_by", key: "cancelled_by" },
      { header: "createdAt", key: "createdAt" },
      { header: "delivered_at", key: "delivered_at" },
      { header: "delivery_city", key: "delivery_city" },
      { header: "delivery_pincode", key: "delivery_pincode" },
      { header: "delivery_type", key: "delivery_type" },
      { header: "descriptor", key: "descriptor" },
      { header: "fulfillments", key: "fulfillments" },
      { header: "items", key: "items" },
      {
        header: "logistics_network_order_id",
        key: "logistics_network_order_id",
      },
      {
        header: "logistics_network_transaction_id",
        key: "logistics_network_transaction_id",
      },
      { header: "offers", key: "offers" },
      { header: "order_category", key: "order_category" },
      { header: "paymentStatus", key: "paymentStatus" },
      { header: "provider", key: "provider" },
      { header: "quote", key: "quote" },
      { header: "seller_pincode", key: "seller_pincode" },
      { header: "shipped_at", key: "shipped_at" },
      { header: "sku_code", key: "sku_code" },
      { header: "sku_name", key: "sku_name" },
      { header: "updatedAt", key: "updatedAt" },
      { header: "state", key: "state" },
      { header: "CreatedBy", key: "CreatedBy" },
      { header: "__v", key: "__v" },
    ];

    worksheet.addRows(orders);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Orders.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
  }

  /**
   * Reconciliations
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetReconciliations(req, res, next) {
    const { params, query } = req;
    const { id } = params;
    let pageNo = Number(query?.page_no) || 1;
    let perPage = Number(query?.per_page) || 10;
    const reconciliations = await getReconciliationByUserId(
      id,
      pageNo,
      perPage
    );
    var response = {};
    response["status"] = true;
    response["data"] = reconciliations.data;
    response["pagination"] = reconciliations.pagination;
    res.json(response);
  }

  /**
   * Reconciliations
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async DownloadReconciliations(req, res, next) {
    const { params } = req;
    const { id } = params;
    const reconciliations = await downloadReconciliationByUserId(id);

    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet("Reconciliations");
    worksheet.columns = [
      { header: "_id", key: "_id" },
      { header: "id", key: "id" },
      { header: "orderId", key: "orderId" },
      { header: "invoiceId", key: "invoiceId" },
      { header: "orderNumber", key: "orderNumber" },
      { header: "paymentStatus", key: "paymentStatus" },
      { header: "orderStatus", key: "orderStatus" },
      { header: "cartDiscount", key: "cartDiscount" },
      { header: "orderCurrency", key: "orderCurrency" },
      { header: "paymentMethod", key: "paymentMethod" },
      { header: "skuId", key: "skuId" },
      { header: "lineItemAmount", key: "lineItemAmount" },
      { header: "itemSkuCount", key: "itemSkuCount" },
      { header: "orderType", key: "orderType" },
      { header: "declaredPrice", key: "declaredPrice" },
      { header: "ondcCommissionFee", key: "ondcCommissionFee" },
      { header: "ondcTax", key: "ondcTax" },
      { header: "ondcTotalAmount", key: "ondcTotalAmount" },
      { header: "buyerAppFee", key: "buyerAppFee" },
      { header: "buyerAppTax", key: "buyerAppTax" },
      { header: "buyerAppTotalAmount", key: "buyerAppTotalAmount" },
      { header: "sellerAppFee", key: "sellerAppFee" },
      { header: "sellerAppTax", key: "sellerAppTax" },
      { header: "sellerAppTotalAmount", key: "sellerAppTotalAmount" },
      { header: "paymentGatewayFee", key: "paymentGatewayFee" },
      { header: "paymentGatewayTax", key: "paymentGatewayTax" },
      { header: "paymentGatewayTotalAmount", key: "paymentGatewayTotalAmount" },
      { header: "gatewayFee", key: "gatewayFee" },
      { header: "gatewayTax", key: "gatewayTax" },
      { header: "gatewayTotal", key: "gatewayTotal" },
      { header: "shippingFee", key: "shippingFee" },
      { header: "shippingFeeTax", key: "shippingFeeTax" },
      { header: "shippingTotal", key: "shippingTotal" },
      { header: "orderTotal", key: "orderTotal" },
      { header: "taxGstTotal", key: "taxGstTotal" },
      { header: "withHoldingTaxBuyerApp", key: "withHoldingTaxBuyerApp" },
      { header: "withHoldingTaxSellerApp", key: "withHoldingTaxSellerApp" },
      { header: "tdsByBuyerApp", key: "tdsByBuyerApp" },
      { header: "tdsBySellerApp", key: "tdsBySellerApp" },
      { header: "tdsByOndc", key: "tdsByOndc" },
      { header: "tdsByGateway", key: "tdsByGateway" },
      { header: "createdBy", key: "createdBy" },
      { header: "createdAt", key: "createdAt" },
      { header: "updatedAt", key: "updatedAt" },
    ];

    worksheet.addRows(reconciliations);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Reconciliations.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
  }

  /**
   * Reconciliation
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetReconciliation(req, res, next) {
    const { params } = req;
    const { id } = params;
    const reconciliations = await getReconciliationById(id);
    var response = {};
    response["status"] = true;
    response["data"] = reconciliations;
    res.json(response);
  }

  /**
   * Update Reconciliations
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async UpdateReconciliation(req, res, next) {
    const { body: request, params } = req;
    const { id } = params;
    var response = await updateReconciliationById(id, request);
    res.json({ status: true, message: "Reconciliation updated" });
  }

  /**
   * payouts
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetPayouts(req, res, next) {
    const { params, query } = req;
    let pageNo = Number(query?.page_no) || 1;
    let perPage = Number(query?.per_page) || 10;
    const { id } = params;
    const payouts = await getPayoutsByUserId(id, pageNo, perPage);
    var response = {};
    response["status"] = true;
    response["data"] = payouts.data;
    response["pagination"] = payouts.pagination;
    res.json(response);
  }

  /**
   * payouts
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async DownloadPayouts(req, res, next) {
    const { params } = req;
    const { id } = params;
    const payouts = await downloadPayoutsByUserId(id);

    var workbook = new Excel.Workbook();
    var worksheet = workbook.addWorksheet("Payouts");
    worksheet.columns = [
      { header: "_id", key: "_id" },
      { header: "id", key: "id" },
      { header: "orderCreatedDate", key: "orderCreatedDate" },
      { header: "buyerAppOrderId", key: "buyerAppOrderId" },
      { header: "networkOrderId", key: "networkOrderId" },
      { header: "sellerNetworkParticipant", key: "sellerNetworkParticipant" },
      { header: "sellerName", key: "sellerName" },
      {
        header: "orderReturnPeriodExpiryDate",
        key: "orderReturnPeriodExpiryDate",
      },
      { header: "settlementDueDate", key: "settlementDueDate" },
      {
        header: "totalItemValueIncludingTax",
        key: "totalItemValueIncludingTax",
      },
      { header: "packagingCharges", key: "packagingCharges" },
      { header: "convenienceCharges", key: "convenienceCharges" },
      { header: "totalOrderValue", key: "totalOrderValue" },
      {
        header: "buyerFinderFeeonTotalOrderValue",
        key: "buyerFinderFeeonTotalOrderValue",
      },
      { header: "merchantPayableAmount", key: "merchantPayableAmount" },
      { header: "createdAt", key: "createdAt" },
      { header: "updatedAt", key: "updatedAt" },
      { header: "__v", key: "__v" },
    ];

    worksheet.addRows(payouts);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Payouts.xlsx"
    );

    await workbook.xlsx.write(res);

    res.status(200).end();
  }

  /**
   * payout
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async GetPayout(req, res, next) {
    const { params } = req;
    const { id } = params;
    const payout = await getPayoutById(id);
    var response = {};
    response["status"] = true;
    response["data"] = payout;
    res.json(response);
  }

  /**
   * CreateRazor PayOrder
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async CreateRazorPayOrder(req, res, next) {
    const { body: request, params } = req;
    const { id } = params;
    var amount = request["amount"];
    var transaction_id = request["transaction_id"];
    var options = {
      amount: amount,
      currency: "INR",
      receipt: transaction_id,
    };

    return razorClient.orders.create(
      options,
      async function (err, razorpayOrderDetails) {
        // var orderDetails = await getOrderByTransactionId(transaction_id)
        var orderDetails = await getCartByTransactionId(transaction_id);
        var orderItems = orderDetails?.order?.["items"];
        var orderQuoteBreakup = orderDetails?.order?.["quote"]?.["breakup"];
        var deliveryCharges = 0;
        var packingCharges = 0;
        var tax = 0;
        var sum = 0;

        for (const i of orderQuoteBreakup) {
          if (i["title"] == "Delivery charges") {
            deliveryCharges = parseInt(i["price"]["value"]);
          } else if (i["title"] == "Packing charges") {
            packingCharges = parseInt(i["price"]["value"]);
          } else if (i["title"] == "Tax") {
            tax = parseInt(i["price"]["value"]);
          }

          sum = sum + parseInt(i["price"]["value"]);
        }
        for (const temItems of orderItems) {
          var productId = temItems?.id;
          var productDetails = getProductById(productId);

          const payOutSchema = {
            orderCreatedDate: orderDetails?.createdAt,
            buyerAppOrderId: orderDetails?.id,
            networkOrderId: orderDetails?.transactionId, // manak suggested to add transaction id
            sellerNetworkParticipant: orderDetails?.provider?.id,
            sellerName: "Eunimart", // not storing // we need to store these from on search
            orderReturnPeriodExpiryDate: "", // not storing @ONDCreturnwindow from item master
            settlementDueDate: "2 days", // not storing
            skuName: productDetails?.descriptor?.name,
            orderQuantity: orderItems?.quantity?.count,
            totalItemValueIncludingTax: orderItems?.quantity
              ? shippingCharges
              : deliveryCharges,
            packagingCharges: packingCharges,
            convenienceCharges: 5,
            totalOrderValue: sum,
            buyerFinderFeeonTotalOrderValue: 3,
            merchantPayableAmount: 100,
            transaction: razorpayOrderDetails,
            paymenttransactionId: razorpayOrderDetails["id"],
            paymentStatus: "created",
          };
          await createPayOut(payOutSchema);

          return res.json({ status: true, data: razorpayOrderDetails });
        }
      }
    );
  }

  /**
   * on_subscribe
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async OnSubscribe(req, res, next) {
    const reqBody = {
      challenge: req.body.challenge,
      client_private_key: process.env.ENCRYPTION_PRIVATE_KEY,
    };

    const response = await BAPApiCall(
      "https://preprod.registry.ondc.org/ondc/challenge/decrypt/text",
      "",
      reqBody
    );
    // return response;
    res.json(response);
  }

  /**
   * search
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  ONDCSubscribe(req, res, next) {
    const searchRequest = req.body;

    applicationService
      .ONDCSubscribe(searchRequest, res)
      .then((response) => {
        if (!response || response === null)
          throw new NoRecordFoundError("No result found");
        else res.json(response);
      })
      .catch((err) => {
        next(err);
      });
  }

  /**
   * @param {Uint8Array} nonce_and_ciphertext
   * @param {string} key
   * @returns {string}
   */
  decrypt_after_extracting_nonce(nonce_and_ciphertext, key) {
    let nonce = nonce_and_ciphertext.slice(0, nonceBytes); //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice
    let ciphertext = nonce_and_ciphertext.slice(nonceBytes);
    var result = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
      nonce,
      ciphertext,
      null,
      nonce,
      key,
      "text"
    );
    return result;
  }

  /**
   * @param {string} nonce_and_ciphertext_str
   * @param {string} key
   * @returns {string}
   */
  decrypt(nonce_and_ciphertext_str, key) {
    var nonce_and_ciphertext = u_atob(nonce_and_ciphertext_str); //converts ascii string of garbled text into binary
    return decrypt_after_extracting_nonce(nonce_and_ciphertext, key);
  }

  u_atob(ascii) {
    //https://stackoverflow.com/a/43271130/
    return Uint8Array.from(atob(ascii), (c) => c.charCodeAt(0));
  }

  CancellationReason = async (req, res, next) => {
    let resp = await cancellation();
    res.send(resp);
  };

  ReturnReason = async (req, res, next) => {
    let resp = await retention();
    res.send(resp);
  };


 //======================= cart controllers ========================================================== 
  async UpsertCartItem(req, res, next) {
    try{
      let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
      let id = decoded?.ID

      let itemId = req.body?.message?.order?.items?.[0]?.id
      
      let cartItemDetails = {
        itemId : itemId,
        select : req.body,
        context: req.body?.context,
        order : req.body?.message?.order,
        CreatedBy : id,
      };

      let filterQuery = {
        CreatedBy: id,
        itemId : itemId,
      }

      await UpsertBapUserCartItem(filterQuery, cartItemDetails)

      let response = {
        status : true,
        message : "Cart upserted successfully"
      }
      res.json(response);
    }
    catch(err){
      console.log("Error ====>>> ",err);
      next(err);
    }
  }
  async DeleteCartItem(req, res, next) {
    try {
      const { id } = req.params;
      let filterQuery = {
          itemId : id,
      }

      let cartitem = await DeleteBapUserCartItem(filterQuery);
      let  response = {
        status : true ,
        data : cartitem
      };
      res.json(response);
    }
    catch (err) {
      next(err);
    }
  }
  async DeleteCart(req, res, next) {
    try {
      let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
      let id = decoded?.ID

      let filterQuery = {
          CreatedBy : id,
      }

      let cartitem = await DeleteBapUserCartItem(filterQuery);
      let  response = {
        status : true ,
        data : cartitem
      };
      res.json(response);
    }
    catch (err) {
      next(err);
    }
  }
  async GetCartItemsOfUser(req, res, next){
    try {
      let query = res.params
      let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
      let id = decoded?.ID

      let pageNo = Number(query?.page_no) || 1;
      let perPage = Number(query?.per_page) || 10;

      let filterQuery = {
        CreatedBy : id,
      }
     
      let cartItems = await ListBapUserCartItems(filterQuery, pageNo, perPage);
      let response = {
        status : true,
        pagination : cartItems?.pagination,
        data : cartItems.data,
      }

      res.json(response);
    } 
    catch (err) {
      next(err);
    }
  }

  //===================================================================================================


  async GenerateOrderCsv(req, res, next) {
    let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
    let user_id = decoded?.ID || 1

    const orders = await ListAllOrders();
    let order_data = []
    orders.forEach(order => {
      let formatted_data = {}
      formatted_data["Buyer_NP_Name"] = order?.context?.bap_id,
        formatted_data["Seller_NP_Name"] = order?.bppDescriptor?.name || order?.context?.bpp_id,
        formatted_data["Network_Order_Id"] = order?.context?.transaction_id,
        formatted_data["Network_Transaction_Id"] = order?.context?.transaction_id,
        formatted_data["Buyer_NP_Order_Item_Id"] = order?.items?.[0]?.id,
        formatted_data["Buyer_NP_Order_Id"] = order?.id,
        formatted_data["Order_Status"] = order?.state,
        formatted_data["Name_of_Seller"] = order?.bppProvider?.id || "SIVA-ONDC-STORE-1",
        formatted_data["Order_Category"] = order?.item?.[0]?.category,
        formatted_data["Shipped_At_Date_&_Time"] = order?.shipped_at || "",
        formatted_data["Delivered_At_Date_&_Time"] = order?.delivered_at || "",
        formatted_data["Delivery Type"] = order?.delivery_type || "OFF NETWORK	",
        formatted_data["Logistics_Network_Order_Id"] = order?.logistics_network_order_id,
        formatted_data["Logistics_Network_Transaction_Id"] = order?.logistics_network_transaction_id,
        formatted_data['Delivery_City'] = order?.fulfillments?.end?.location?.address?.city,
        formatted_data['Delivery_Pincode'] = order?.fulfillments?.end?.location?.address?.areaCode,
        formatted_data["Cancelled_At_Date_&_Time"] = order?.cancelled_at || "",
        formatted_data["Cancelled_By"] = order?.cancelled_by || "",
        formatted_data["Cancellation_Reason"] = order?.cancellation_reason || "",
        formatted_data["Cancellation_Remark"] = order?.cancellation_remark || "",
        formatted_data["Total_Order_Value"] = order?.quote?.price?.value || ""
      order_data.push(formatted_data)
    });
    let csv = ConvertJsonToCsv(order_data)
    let file_name = uuidv4();

    await upload(file_name, csv, user_id,"orderData","csv").then(result => {      
      res.json({
        "meta": {
            "success": true,
            "message": "Link of the downloaded data",
            "info": null
        },
        "data": {
            "file_name": file_name,
            "link": result
        }
    });
  }).catch(e => {
      console.error("ERROR WHILE AUDITING USING S3")
      console.error(e)
  })

  }


  async SearchProductCategory(req, res, next) {
    try{
    const {query} = req;
    let name=query.name
    console.log("name-->",name)
    let response = {};


    let resp=await SearchProductCategory(name)
    console.log("resp",resp)
        if(response === null){
            response["status"]=false
            throw new NoRecordFoundError("No result found");
          }
        else{
          response['status']=true
          response['data']=resp
          res.json(response);
        }
  }catch(err) {
        next(err);
    };
}
}

export default ApplicationController;