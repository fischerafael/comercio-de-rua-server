const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(express.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            products: [String!]!
        }
        type RootMutation {
            createProduct(name: String): String
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        products: () => {
            return ['Sanduíce', 'Coca', 'Cerveja']
        },
        createProduct: (args) => {
            const productName = args.name
            return productName
        }
    },
    graphiql: true,
}))

app.listen(process.env.PORT || 3333, () => console.log('Server running on port 3333'))