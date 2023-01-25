//@ts-check
import { consumeKafkaEvent, produceKafkaEvent,kafkaClusters } from "../../../shared/eda/kafka.js"
import { topics} from '../../../shared/eda/consumerInit/initConsumer.js'
import { addOrUpdateProvider } from "../../../shared/db/provider_db_service.js"


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

const createOrUpdateProviderConsumer = async(consumerConfig)=>{
    let consumer = await consumeKafkaEvent(consumerConfig)
    
    await consumer.run({
      autoCommitInterval: 5000,
        eachMessage: async ({ topic, partition, message }) => {
          var flag=true
          let request = JSON.parse(message.value.toString()); 
          request.data.map((i)=>{
                  (async()=>{
                    try{
                    var g=await addOrUpdateProvider(i)
                    }
                    catch(err){
                        flag=false
                    }
                })()
                })
        if(flag){
          var d={"meta_data":request.meta_data,data:{"success":true}}
          await produceKafkaEvent(kafkaClusters.Tech,topics.PROVIDER_CREATE_UPDATE_ACK,d )
        }
        else{
          var d={"meta_data":request.meta_data,data:{"success":false}}
          await produceKafkaEvent(kafkaClusters.Tech,topics.PROVIDER_CREATE_UPDATE_ACK,d )
        }
          
        },
        
         
      })  
}


export {
  createOrUpdateProviderConsumer
}
