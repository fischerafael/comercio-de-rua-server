const { buildSchema } = require('graphql')

module.exports = buildSchema(`
type Product {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    creator: User!
}
type User {
    _id: ID!
    email: String!
    password: String
    name: String!
    phone: String!
    description: String
}
type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}
input ProductInput {
    title: String!
    description: String!
    price: Float!
}
input UserInput {
    email: String!
    password: String!
    name: String!
    phone: String!
    description: String
}
type RootQuery {
    products: [Product!]!
    users: [User!]!
    product(email: String!): [Product!]!
    login(email: String!, password: String!): AuthData!
}
type RootMutation {
    createProduct(productInput: ProductInput): Product
    createUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)