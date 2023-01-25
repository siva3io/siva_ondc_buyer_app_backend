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

let returns_reason = [
    {
        "code":"001",
        "reason":"Buyer does not want product any more",
        "whether_applicable_for_refund_for_non_returnable_items":false
    },
    {
        "code":"002",
        "reason":"Product available at lower than order price",
        "whether_applicable_for_refund_for_non_returnable_items":false
    
    },
    {
        "code":"003",
        "reason":"Product damaged or not in usable state",
        "whether_applicable_for_refund_for_non_returnable_items":true
    
    },
    {
        "code":"004",
        "reason":"Product is of incorrect quantity or size",
        "whether_applicable_for_refund_for_non_returnable_items":true
    
    },
    {
        "code":"005",
        "reason":"Product delivered is different from what was shown and ordered",
        "whether_applicable_for_refund_for_non_returnable_items":true
    
    }
]

export {returns_reason}