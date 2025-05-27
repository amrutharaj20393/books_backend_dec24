const users = require("../model/userModel")
const jwt = require('jsonwebtoken')

//register
exports.registerController = async (req, res) => {
    //logic
    const { username, email, password } = req.body
    console.log(username, email, password)
    try {
        const existingUser = await users.findOne({ email: email })
        if (existingUser) {
            res.status(409).json('Already exist')
        }
        else {

            //create object for model "users"
            const newUser = new users({
                username,
                email,
                password
            })
            await newUser.save()//mongodb save
            res.status(200).json(newUser)
        }

    } catch (error) {
        res.status(500).json(error)
    }

    res.status(200).json('request received')

}

//login controller
exports.loginController = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password)
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            if (existingUser.password == password) {
                const token = jwt.sign({ usermail: existingUser.email }, 'secretkey')
                res.status(200).json({ existingUser, token })
            }
            else {
                res.status(401).json('incorrect email or password')//pasword does not match
            }
        }
        else {
            res.status(404).json('incorrect email or password')//user does not exist
        }

    }
    catch (error) {
        res.status(500).json(error)
    }
}

//google login
exports.googleLoginController = async (req, res) => {
    const { username, email, password, photo } = req.body
    console.log(username, email, password, photo)

    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const token = jwt.sign({ usermail: existingUser.email }, 'secretkey')
            res.status(200).json({ existingUser, token })
        }
        else {
            const newUser = new users({
                username,
                email,
                password,
                profile: photo
            })
            await newUser.save()//mongodb save
            const token = jwt.sign({ usermail: newUser.email }, 'secretkey')
            res.status(200).json({ existingUser: newUser, token })
        }


    } catch (error) {
        res.status(500).json(error)
    }
}
//get all users for admin

exports.getAllUsersController = async (req, res) => {
    const email = req.payload
    console.log(email)
    try {

        const Allusers = await users.find({ email: { $ne: email } })
        res.status(200).json(Allusers)

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.editAdminprofileController = async (req, res) => {
    const { username, password, profile } = req.body
    const prof = req.file ? req.file.filename : profile
    console.log(prof)
    const email = req.payload
    console.log(email)
    try {

        const Admindetails = await users.findOneAndUpdate({ email }, { username, email, profile: prof, password }, { new: true })
        await Admindetails.save()
        res.status(200).json(Admindetails)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.editUserProfileController=async(req,res)=>{

    const { username, password,bio, profile } = req.body
    const prof = req.file ? req.file.filename : profile
    console.log(prof)
    const email = req.payload
    console.log(email)
    try {

        const Userdetails = await users.findOneAndUpdate({ email }, { username, email, profile: prof, password,bio }, { new: true })
        await Userdetails.save()
        res.status(200).json(Userdetails)
    } catch (error) {
        res.status(500).json(error)
    }

}


