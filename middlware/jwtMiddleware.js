
//import jwt
const jwt = require('jsonwebtoken')
const jwtMiddlware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    // console.log(token)
    try {
        const jwtResponse = jwt.verify(token, "secretkey")
        console.log(jwtResponse)
        req.payload = jwtResponse.usermail
      //  console.log(req.payload )
        next()
    } catch (error) {
        res.status(401).json("invalid token", error)
    }


}
module.exports = jwtMiddlware