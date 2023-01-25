
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

let cancellation_reason = [
    {
        "code":"001",
        "reason":"Price of one or more items have changed due to which buyer was asked to make additional payment",
        "triggers_rto":false,
        "cause_of_cancellation":"seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"002",
        "reason":"One or more items in the Order not available",
        "triggers_rto":false,
        "cause_of_cancellation":"seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"003",
        "reason":"Product available at lower than order price",
        "triggers_rto":false,
        "cause_of_cancellation":"seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"004",
        "reason":"Order in pending shipment / delivery state for too long",
        "triggers_rto":false,
        "cause_of_cancellation":"Logistics Provider/ Seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"005",
        "reason":"Merchant rejected the order",
        "triggers_rto":false,
        "cause_of_cancellation":"Seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"006",
        "reason":"Order not shipped as per buyer app SLA",
        "triggers_rto":false,
        "cause_of_cancellation":"Seller",
        "weather_applicable_for_part_cancel":true
    },
    {
        "code":"009",
        "reason":"Wrong product delivered",
        "triggers_rto":true,
        "cause_of_cancellation":"Seller",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"010",
        "reason":"Buyer wants to modify details",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer/Buyer App",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"011",
        "reason":"Buyer not found or cannot be contacted",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer / Buyer App (prepaid), Seller(COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"012",
        "reason":"Buyer does not want product any more",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer / Buyer App (prepaid), Seller (COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"013",
        "reason":"Buyer refused to accept delivery",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer (prepaid), Seller (COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"014",
        "reason":"Address not found",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer (prepaid), Seller (COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"015",
        "reason":"Buyer not available at location",
        "triggers_rto":true,
        "cause_of_cancellation":"Buyer (prepaid), Seller (COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"016",
        "reason":"Address not found",
        "triggers_rto":false,
        "cause_of_cancellation":"Logistics Provider",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"017",
        "reason":"Accident / rain / strike / vehicle issues",
        "triggers_rto":false,
        "cause_of_cancellation":"Buyer (prepaid), Seller (COD)",
        "weather_applicable_for_part_cancel":false
    },
    {
        "code":"018",
        "reason":"Address not found",
        "triggers_rto":false,
        "cause_of_cancellation":"Logistics Provider",
        "weather_applicable_for_part_cancel":false
    },
]

export {cancellation_reason}