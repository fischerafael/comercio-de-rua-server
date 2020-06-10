const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const mongoose = require('mongoose')

const Product = require('./models/product')

const app = express()

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
        products: async () => {
            try {
                const result = await Product.find()
                return (result)
            } catch(err) {
                console.log(err)
                throw err
            }
            Product.find()
        },
        createProduct: async (args) => {            
            const product = new Product({
                title: args.productInput.title,
                description: args.productInput.description, 
                price: +args.productInput.price,
            })
            try {
                const result = await product.save()
                console.log(result)
                return (result)
                //return {...result._doc}
            } catch(err) {
                console.log(err)
                throw err
            }            
        }
    },
    graphiql: true,
}))

mongoose.connect('mongodb+srv://comercio-de-rua:comercio-de-rua@cluster0-qqsuz.mongodb.net/comercioderua?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}, () => console.log('Connected to database'))

app.listen(process.env.PORT || 3333, () => console.log('Server running on port 3333'))