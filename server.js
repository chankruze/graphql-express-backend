/*
Author: chankruze (chankruze@geekofia.in)
Created: Wed Sep 16 2020 11:32:43 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2020 and beyond
*/

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema')
const os = require('os')
const cors = require('cors')
const path = require('path')

const app = express()
app.use(cors())

app.use('/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    })
)

app.use(express.static('public'))

app.get('*', (re, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 5005
const networkInterfaces = os.networkInterfaces()
let SERV_URL = networkInterfaces.eth0[0].address

app.listen(PORT, () => console.log(`Server on network: http://${SERV_URL}:${PORT}/`))
