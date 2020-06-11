const express = require('express')
const graphqlHttp = require('express-graphql')
const mongoose = require('mongoose')

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth = require('./middleware/is-auth')

const app = express()

app.use(express.json())
app.use(isAuth)

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
}))

mongoose.connect('mongodb+srv://comercio-de-rua:comercio-de-rua@cluster0-qqsuz.mongodb.net/comercioderua?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}, () => console.log('Connected to database'))

app.listen(process.env.PORT || 3333, () => console.log('Server running on port 3333'))