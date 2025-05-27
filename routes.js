//import the express
const express = require('express')
//import usercontoller
const userController = require('./controller/userController')
//import bookController
const bookController = require('./controller/bookController')
//import jwtMiddleware
const jwtMiddlware = require('./middlware/jwtMiddleware')

//import job controller
const jobController = require('./controller/jobController')

//import app controller
const appController = require('./controller/appController')

//import multer config
const multerConfig = require('./middlware/imagemulterMiddlware')

//import pdfmulter config
const pdfmulterConfig = require('./middlware/pdfmulterMiddleware')
//create instance  for class
const route = new express.Router()


//path for register
route.post('/register', userController.registerController)

//path for login
route.post('/login', userController.loginController)

//path gor googke login
route.post('/google-login', userController.googleLoginController)

route.get('/all-home-book', bookController.getHomeBookController)
//path to get all jobs
route.get('/all-jobs', jobController.getAllJobController)


//------------------------user

//path to add books
route.post('/add-book', jwtMiddlware, multerConfig.array('uploadedImages', 3), bookController.addBookController)
//routes export

//path get all books
route.get('/all-books', jwtMiddlware, bookController.getAllBookController)

//path to get a particular book
route.get('/view-book/:id', bookController.getAbookController)


//path to apply a job
route.post('/apply-job', pdfmulterConfig.single('resume'), appController.addApplicationController)

//path to update user profile
route.put('/userprofile-update',jwtMiddlware,multerConfig.single('profile'),userController.editUserProfileController)

//path to get all user added book
route.get('/user-book',jwtMiddlware,bookController.getAllUserBookController)

//path to get all user brought book
route.get('/user-brought-book',jwtMiddlware,bookController.getAllUserBroughtController)

//path to delete a user book
route.delete('/delete-user-books/:id',bookController.deleteUserBookController)

//path to payment
//route.put('/make-payment',jwtMiddlware,bookController.makePaymentController)
route.put('/make-payment',jwtMiddlware,bookController.makepaymentController)

///---------------------Admin
//to get all bookss
route.get('/admin-all-books', jwtMiddlware, bookController.getAllBookAdminController)

//path to approve book
route.put('/approve-books', jwtMiddlware, bookController.approveBookController)

//path to get all user 
route.get('/all-users', jwtMiddlware, userController.getAllUsersController)

//path  to add new job
route.post('/add-job', jobController.addJobController)
//to delete a job
route.delete('/delete-job/:id', jobController.deleteAJobController)

//path toget all applcations
route.get('/all-application',appController.getAllApplicationControoler)


//path to update the admin profile
route.put('/adminprofile-update',jwtMiddlware,multerConfig.single('profile'),userController.editAdminprofileController)

module.exports = route