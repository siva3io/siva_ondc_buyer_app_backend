import { response } from 'express';
import JsonWebToken from '../../../shared/lib/authentication/json-web-token.js';
import ProductService from './products.service.js'
const productService = new ProductService();

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

const jsonWebToken = new JsonWebToken()

class ProductController {

    async CreateProduct(req, res, next) {
        let decoded = await jsonWebToken.verify((req.headers.authorization).split(" ")[1])
        req.body.CreatedBy = decoded?.ID
    await productService.createProduct(req.body).then(response => {
                res.json({ ...response });
            }).catch((err) => {
                // console.log(err);
            });

       
    }
    async UpdateProduct(req, res, next) {
        
        await productService.updateProduct(req).then(response => {
                    res.json({ ...response });
                }).catch((err) => {
                    // console.log(err);
                });
    
           
        }

    async ViewProduct(req, res, next) {
        const id = req.params['id'];
        await productService.viewProduct(id).then(response => {
            res.json({ ...response });
        }).catch((err) => {
            // console.log(err);
        });
    }

    async ListProduct( req,res, next) {
        const{query}= req;
        let pageNo = Number(query?.page_no) || 1;
        let perPage = Number(query?.per_page) || 10;
        const products= await productService.listProduct(pageNo, perPage);
        var response={};
        response["status"] = true;
        response["data"] = products.data;
        response["pagination"]=products.pagination;
        res.json(response); 
        // .then(response=>{
        //     res.json(response);
        // }).catch((err) => {
        //     // console.log(err);
        // })
    }

  }
  
  export default ProductController;