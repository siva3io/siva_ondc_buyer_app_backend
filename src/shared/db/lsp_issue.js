import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { v4 as uuidv4 } from 'uuid';

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
        id: {type: String},
        complainant_info: {type: Object},
        rating: {type: String},
        order: {type:Object},
        order_id: {type:String},
        item_id: {type:[String]},
        fulfillment_id: {type:[String]},
        transaction_id: { type: String},
        order_time_stamp: {type:String},
        order_created_at: {type: String},
        order_updated_at: {type: String},
        description: {type: Object},
        supplementary_information: {type: [Object]},
        additional_information: {type: [Object]},
        category: { type: String},
        issue_type :{type:String,default:"Issue"},
        expected_response_time: {type: Object},
        expected_resolution_time: {type: Object},
        source:{type:Object},
        status: {type: Object},
        finalized_odr: {type: Object},
        created_at: {type:Date, default:new Date()},
        modified_at: {type:Date, default:new Date()}
    },
    { _id: false, timestamps: false }
    )
    
    const ResolutionSchema = new mongoose.Schema(
    {
        id: {type: String, default: () => uuidv4()},
        resolution: {type: String},
        resolution_remarks: {type: String},
        gro_remarks: {type: String},
        dispute_resolution_remarks: {type: String},
        resolution_action: {type: String}
    },
    { _id: false, timestamps: false }
    )
    
const GroSchema = new mongoose.Schema(
        {
            person: {type: Object},
            contact: {type: Object},
            gro_type: {type: String}
        },
        { _id: false, timestamps: false }
    )

const ResolutionSupportSchema = new mongoose.Schema(
    {
        respondentChatLink: {type: String},
        respondentEmail: {type: String},
        respondentContact: {type : Object},
        respondentFaqs: {type: Object},
        additional_sources: {type: Object},
        gros: {type: [GroSchema]},
        selected_odrs: {type: [Object]}
    },
    { _id: false, timestamps: false }
)

const RespondentInfoSchema= new mongoose.Schema(
    {
        type: {type:String},
        organization:{type: Object},
        resolution_support: {type: ResolutionSupportSchema}
    },
    { _id: false, timestamps: false }
)

const ResolutionProviderSchema = new mongoose.Schema(
    {
        respondent_info: {type : RespondentInfoSchema}
    },
    { _id: false, timestamps: false }
)

const LspIssueSchema = new mongoose.Schema(
    {
        context:{type:Object},
        network_issue_id: { type: String, default: () => uuidv4()},
        issue_id_crm_lsp: { type: String, default: () => uuidv4()},
        issue:{type:IssueSchema},
        ttl: {type: String},
        resolution_provider: {type: ResolutionProviderSchema},
        resolution: {type: ResolutionSchema},
        transactionId: { type: String},

        status: {type:Object},
        comments: {type:[CommentSchema]},
        issue_category: {type:String},
        issue_status_history: {type: [Object]},
        parent_issue_id: {type: String},
        buyer: { type: String},
        seller: { type: String},
        provider_name: { type: String},
        CreatedBy: { type: String},
        AssignedFrom: {type: String},
        AssignedTo: { type: String},
        createdAt: { type: Date, default: new Date()}
        
        // issue_resolution_remarks: {type: String},
        // grievance_escalation_flag: {type: Boolean},
        // interfacing_app_gro_name: {type: String},
        // interfacing_app_gro_email: {type: String},
        // interfacing_app_gro_phone_number: {type: String},
        // interfacing_app_gro_remarks: {type: String},
        // counterparty_app_gro_name: {type: String},
        // counterparty_app_gro_email: {type: String},
        // counterparty_app_gro_phone_number: {type: String},
        // counterparty_app_gro_remarks: {type: String},
        // cascaded_app_gro_name: {type: String},
        // cascaded_app_gro_email: {type: String},
        // cascaded_app_gro_phone_number: {type: String},
        // cascaded_app_gro_remarks: {type: String},
        // dispute_escalation_flag: {type: Boolean},
        // selected_odrs: {type: [Object]},
        // issues: {type: [Object]},
        // comments: {type: [CommentSchema]},
        // buyer: { type: String},
        // seller: { type: String},
        // provider_name: { type: String},
        // resolution_provider: {type: Object},
        // resolution: {type: Object},
        // on_context: {type: Object},
    },
    { _id: true, timestamps: true }
)


LspIssueSchema.index({userId: 1, createdAt: -1});


// const Issue = mongoose.model('issue',IssueSchema,"issues")
LspIssueSchema.plugin(mongoosePaginate)
const LspIssue = mongoose.model('lsp_issue',LspIssueSchema,"lsp_issue")


export default LspIssue;