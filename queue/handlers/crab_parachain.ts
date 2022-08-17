// const fetch = require('../fetch.js').fetch('http://localhost:3000');

import { MessageChannel } from "worker_threads"

// const buildQueryStr = messageId => {
//     return `{  
//         query {
//             s2sEvent(id: "${messageId}") {
//                 id
//                 laneId
//                 nonce
//                 requestTxHash
//                 senderId
//                 block
//             }
//         }
//     }`
// }
// const { Sequelize, DataTypes } = require('sequelize');

// const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/postgres')

// const Message = require('../models/Message.js')(sequelize, DataTypes)

// exports.handle = async (params) => {
//     const queryStr = buildQueryStr(params.messageId)

//     const result = await fetch(queryStr, "s2sEvent")
//     console.log(result.id)
//     const blockNumber = result.block.number
//     Message.create()


//     return {
//         messageKey: `${blockNumber}-${params.messageId}`, // dirname
//         messageData: result // file content
//         // nextHandler: {
//         //     name: "kusama",
//         //     params: {
//         //         messageId: params.messageId
//         //     }
//         // }
//     }
// }

export const handle = async (params: any) => {
    console.log(params)
}