const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

const products = []

app.use(express.json())

app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type Product {
            _id: ID!
            title: String!
            description: String!
            price: Float!
        }
        input ProductInput {
            title: String!
            description: String!
            price: Float!
        }
        type RootQuery {
            products: [Product!]!
        }
        type RootMutation {
            createProduct(productInput: ProductInput): Product
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        products: () => {
            return products
        },
        createProduct: (args) => {
            const product = {
                _id: Math.random().toString(),
                title: args.productInput.title,
                description: args.productInput.description,
                price: +args.productInput.price,
            }
            products.push(product)
            return product
        }
    },
    graphiql: true,
}))

app.listen(process.env.PORT || 3333, () => console.log('Server running on port 3333'))