import JuspayService from './juspay.service.js';
import {
    getPaymentByUserId,
    getPaymentById,
    updatePaymentById,
    updatePayoutByPaymentTransactionId,
    UpdateOrderWithTransactionId,
    getPayoutByPaymentTransactionId,
    getAllPayments

  } from "../../../shared/db/dbService.js";
import Excel from 'exceljs';

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

const juspayService = new JuspayService();

class PaymentController 
{

    /**
    * sign payload
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async signPayload(req, res, next) 
    {
        try{
            const data = req.body;
                
            const signedPayload = await juspayService.signPayload(data);
            return res.json({ signedPayload: signedPayload });
        }
        catch(err) {
            next(err);
        }

    }

    /**
    * get order status
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    getOrderStatus(req, res, next) {
        const { params, user } = req;
        const { orderId: orderId } = params;     
        
        juspayService.getOrderStatus(orderId, user).then(orderStatus => {
            res.json({data: orderStatus});
        }).catch((err) => {
            next(err);
        });
    }

    /**
    * verify payment
    * @param {*} req    HTTP request object
    * @param {*} res    HTTP response object
    * @param {*} next   Callback argument to the middleware function
    * @return {callback}
    */
    async verifyPayment(req, res, next) 
    {
        const data = req.body;

        try{
            await juspayService.verifyPayment(data);
            return res.json({ status: "ok" });
        }
        catch(err) {
            next(err);
        }

    }

      /**
   * Payments
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
   async GetPayments(req, res, next) {
    const { params,query } = req;
    const { id } = params;
    let pageNo = Number(query?.page_no) || 1;
    let perPage = Number(query?.per_page) || 10;
    const Payments = await getPaymentByUserId(id,pageNo,perPage);
    var response = {};
    response["status"] = true;
    response["data"] = Payments.data;
    response["pagination"]=Payments.pagination
    res.json(response);
  }
        /**
   * Payments
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
        async GetAllPayments(req, res, next) {
            const { params,query } = req;
            let pageNo = Number(query?.page_no) || 1;
            let perPage = Number(query?.per_page) || 10;
            const Payments = await getAllPayments(pageNo,perPage);
            var response = {};
            response["status"] = true;
            response["data"] = Payments.data;
            response["pagination"]=Payments.pagination
            res.json(response);
          }

      /**
   * Payments
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
      async DownloadPayments(req, res, next) {
        const { params } = req;
        const { id } = params;
        const Payments = await getPaymentByUserId(id);
        var workbook = new Excel.Workbook();
        var worksheet = workbook.addWorksheet("Payments");
        worksheet.columns = [
        {header:'_id', key: '_id'},
        {header:'id', key: 'id'},
        {header:'orderId', key: 'orderId'},
        {header:'invoiceId', key: 'invoiceId'},
        {header:'orderNumber', key: 'orderNumber'},
        {header:'orderDate', key: 'orderDate'},
        {header:'paymentStatus', key: 'paymentStatus'},
        {header:'paidDate', key: 'paidDate'},
        {header:'orderStatus', key: 'orderStatus'},
        {header:'cartDiscount', key: 'cartDiscount'},
        {header:'orderCurrency', key: 'orderCurrency'},
        {header:'paymentMethod', key: 'paymentMethod'},
        {header:'txnDate', key: 'txnDate'},
        {header:'skuId', key: 'skuId'},
        {header:'lineItemAmount', key: 'lineItemAmount'},
        {header:'itemSkuCount', key: 'itemSkuCount'},
        {header:'orderType', key: 'orderType'},
        {header:'declaredPrice', key: 'declaredPrice'},
        {header:'ondcCommissionFee', key: 'ondcCommissionFee'},
        {header:'ondcTax', key: 'ondcTax'},
        {header:'ondcTotalAmount', key: 'ondcTotalAmount'},
        {header:'buyerAppFee', key: 'buyerAppFee'},
        {header:'buyerAppTax', key: 'buyerAppTax'},
        {header:'buyerAppTotalAmount', key: 'buyerAppTotalAmount'},
        {header:'sellerAppFee', key: 'sellerAppFee'},
        {header:'sellerAppTax', key: 'sellerAppTax'},
        {header:'sellerAppTotalAmount', key: 'sellerAppTotalAmount'},
        {header:'paymentGatewayFee', key: 'paymentGatewayFee'},
        {header:'paymentGatewayTax', key: 'paymentGatewayTax'},
        {header:'paymentGatewayTotalAmount', key: 'paymentGatewayTotalAmount'},
        {header:'gatewayFee', key: 'gatewayFee'},
        {header:'gatewayTax', key: 'gatewayTax'},
        {header:'gatewayTotal', key: 'gatewayTotal'},
        {header:'shippingFee', key: 'shippingFee'},
        {header:'shippingFeeTax', key: 'shippingFeeTax'},
        {header:'shippingTotal', key: 'shippingTotal'},
        {header:'orderTotal', key: 'orderTotal'},
        {header:'taxGstTotal', key: 'taxGstTotal'},
        {header:'withHoldingTaxBuyerApp', key: 'withHoldingTaxBuyerApp'},
        {header:'withHoldingTaxSellerApp', key: 'withHoldingTaxSellerApp'},
        {header:'tdsByBuyerApp', key: 'tdsByBuyerApp'},
        {header:'tdsBySellerApp', key: 'tdsBySellerApp'},
        {header:'tdsByOndc', key: 'tdsByOndc'},
        {header:'tdsByGateway', key: 'tdsByGateway'},
        {header:'createdBy', key: 'createdBy'}
        ]

        worksheet.addRows(Payments);

        res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "Payments.xlsx"
        );

        await workbook.xlsx.write(res);

        res.status(200).end();
    }

  /**
   * Payment
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
   async GetPayment(req, res, next) {
    const { params } = req;
    const { id } = params;
    const Payments = await getPaymentById(id);
    var response = {};
    response["status"] = true;
    response["data"] = Payments;
    res.json(response);
  }

  /**
   * Update Payments
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
  async UpdatePayment(req, res, next) {
    const { body: request, params } = req;
    const { id } = params;
    var response = await updatePaymentById(id, request);
    res.json({ status: true, message: "Payment updated" });
  }
  
  /**
   * Update Payments
   * @param {*} req    HTTP request object
   * @param {*} res    HTTP response object
   * @param {*} next   Callback argument to the middleware function
   * @return {callback}
   */
   async UpdatePaymentRazorpayCallback(req, res, next) {
    const { body: request, params } = req;
    const razorpay_order_id = request["razorpay_order_id"]
    var updateSchema = {
        transactionStatus: request,
        paymentStatus: "paid" // check created case ans spell 

    }
    updatePayoutByPaymentTransactionId(razorpay_order_id, updateSchema)
    const data=await getPayoutByPaymentTransactionId(razorpay_order_id)
    UpdateOrderWithTransactionId(data.networkOrderId,"paid")

    // based on relation update payment status in order table (by default paid)
    res.json({ status: true, message: "Payment details updated" });
  }  
}

export default PaymentController;
