const bcrypt = require('bcryptjs')

const Product = require('../../models/product')
const User = require('../../models/user')

module.exports = {
    products: async () => {
        try {
            const result = await Product.find().populate('creator')
            
            return (result)
        } catch(err) {
            console.log(err)
            throw err
        }            
    },
    users: async () => {
        try {
            const users = await User.find()
            return (users)
        } catch(err) {
            throw err
        }
    }        ,
    createProduct: async (args) => {            
        const product = new Product({
            title: args.productInput.title,
            description: args.productInput.description, 
            price: +args.productInput.price,
            creator: '5ee1a82618c3fd52d065197b'
        })
        try {
            const createdProduct = await product.save()                              
            return (createdProduct)
        } catch(err) {
            console.log(err)
            throw err
        }            
    },
    createUser: async (args) => {
        const hashedPassword = await bcrypt.hash(args.userInput.password, 10)
        const user = new User({
            email: args.userInput.email,
            password: hashedPassword,
            name: args.userInput.name,
            phone: args.userInput.phone,
            description: args.userInput.description
        })
        try {
            let result = await User.findOne({ email: args.userInput.email })
            if (result) throw new Error('User already exists')                
            result = await user.save()
            console.log(result)
            return (result)
        } catch(err) {
            console.log(err)
            throw err
        }
    }
}