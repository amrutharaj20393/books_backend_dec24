
const books = require("../model/bookModel")
const stripe = require('stripe')('sk_test_51RSxz22LjIoQ1c2H6yVtyvIwv1PtlVO1yqkVIjwqEaa8ssQQprsEy1PnstUWkjTx4jeSmUlYJ2TtUfVscK74JVND00e61U3ItQ')

//to add books
exports.addBookController = async (req, res) => {
    console.log("inside add book controller")
    // console.log(req.body)//text content
    //console.log(req.files)//image files
    const { title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category } = req.body
    uploadedImg = []
    req.files.map((item) => uploadedImg.push(item.filename))
    console.log(uploadedImg)
    const email = req.payload

    console.log(email)

    try {

        const existingBook = await books.findOne({ title, userMail: email })
        if (existingBook) {
            res.status(401).json('you have already added this book')
        }
        else {
            const newBook = new books({
                title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg,
                userMail: email
            })
            await newBook.save()
            res.status(200).json(newBook)
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getHomeBookController = async (req, res) => {
    try {

        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllBookController = async (req, res) => {
    console.log(req.query)
    const searchkey = req.query.search
    const email = req.payload

    try {
        const query = {
            title: {
                $regex: searchkey, $options: "i"
            },
            userMail: { $ne: email }
        }
        const allBooks = await books.find(query)

        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}
//get a particular book
exports.getAbookController = async (req, res) => {
    const { id } = req.params//where id is passed through parameter
    console.log(id)
    try {

        const abook = await books.findOne({ _id: id })
        res.status(200).json(abook)

    } catch (error) {
        res.status(500).json(error)
    }

}

//to get all books added by a user
exports.getAllUserBookController = async (req, res) => {
    const email = req.payload
    console.log(email)
    try {
        const alluserBook = await books.find({ userMail: email })
        res.status(200).json(alluserBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all books brought by user
exports.getAllUserBroughtController = async (req, res) => {
    const email = req.payload
    console.log(email)
    try {
        const alluserBroughtBook = await books.find({ brought: email })
        res.status(200).json(alluserBroughtBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

//controller to delete a user book
exports.deleteUserBookController = async (req, res) => {
    const { id } = req.params
    console.log(id)
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json("deleted ")
    }

    catch (err) {
        res.status(500).json(error)
    }
}

//for payment 
exports.makepaymentController = async (req, res) => {
    const { bookDetails } = req.body
    const brought = req.payload
    try {
        const existingBook = await books.findByIdAndUpdate(
            { _id: bookDetails._id }, {
            title: bookDetails.title,
            author: bookDetails.author,
            noofpages: bookDetails.noofpages,
            imageurl: bookDetails.imageurl,
            price: bookDetails.price,
            dprice: bookDetails.dprice,
            abstract: bookDetails.abstract,
            publisher: bookDetails.publisher,
            language: bookDetails.language,
            isbn: bookDetails.isbn,
            category: bookDetails.category,
            uploadedImg: bookDetails.uploadedImg,
            status: 'sold',
            userMail: bookDetails.userMail,
            brought: brought
        }, {
            new: true
        })
        const line_item = [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author}|${bookDetails.publisher}`,
                    images: [bookDetails.imageurl],
                    metadata:{
                        title: bookDetails.title,
                        author: bookDetails.author,
                        noofpages: bookDetails.noofpages,
                        imageurl: bookDetails.imageurl,
                        price:`${ bookDetails.price}`,
                        dprice:`${ bookDetails.dprice}`,
                        abstract: bookDetails.abstract.slice(0,20),
                        publisher: bookDetails.publisher,
                        language: bookDetails.language,
                        isbn: bookDetails.isbn,
                        category: bookDetails.category,
                        //uploadedImg: bookDetails.uploadedImg,
                        status: 'sold',
                        userMail: bookDetails.userMail,
                        brought: brought
                    }
                },
                unit_amount:Math.round(bookDetails.dprice*100)//cents to us dollar
            },
            quantity:1
        }]
        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            //purchase using card
            payment_method_types: ["card"],
            //details of product that is buying
            line_items: line_item,
            mode: 'payment',
            success_url: "http://localhost:5173/payment-success",
            cancel_url: "http://localhost:5173/payment-error"
        });
        console.log(session)
        res.status(200).json({ sessionId: session.id })
    } catch (error) {
        res.status(500).json(error)
    }

    //create stripe checkout section

}

//////--------------------Admin
//============

exports.getAllBookAdminController = async (req, res) => {

    try {

        const allExistingBooks = await books.find()
        res.status(200).json(allExistingBooks)

    } catch (error) {
        res.status(500).json(error)
    }

}

///--to approve book
exports.approveBookController = async (req, res) => {
    const { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, brought } = req.body
    console.log(_id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status, userMail, brought)
    try {

        const existingBook = await books.findByIdAndUpdate({ _id }, { _id, title, author, noofpages, imageurl, price, dprice, abstract, publisher, language, isbn, category, uploadedImg, status: 'Approved', userMail, brought }, { new: true })

        await existingBook.save()
        res.status(200).json(existingBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

