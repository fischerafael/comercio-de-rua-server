const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    product: async ({ email }) => {
        try {
            const getUserEmail = await User.findOne({ email })
            if (!getUserEmail) throw new Error('User does not exist')
            console.log(getUserEmail._id)
            const productsOf = await Product.find({ creator: getUserEmail._id }).populate('creator')            
            return (productsOf)
        } catch (err) {
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
    },
    login: async ({ email, password }) => {
        try {
            const userEmail = await User.findOne({ email: email })
            if (!userEmail) throw new Error('User does not exist')
            const isEqual = await bcrypt.compare(password, userEmail.password)
            if (!isEqual) throw new Error('Incorrect password')            
            const token = jwt.sign({ userId: userEmail._id, email: userEmail.email }, 'secret-key', {
                expiresIn: '1h'
            })            
            return { userId: userEmail.id, token: token, tokenExpiration: 1 }
        } catch(err) {
            throw err
        }
    },
    createProduct: async (args, req) => {    
        if (!req.isAuth) throw new Error('Unauthenticated')
        const product = new Product({
            title: args.productInput.title,
            description: args.productInput.description, 
            price: +args.productInput.price,
            creator: '5ee2409365a32229b048ce1d'
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