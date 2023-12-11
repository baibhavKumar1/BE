const jwt = require('jsonwebtoken');
const BlacklistModel = require('../Model/blacklist.model');

const auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const blacked = await BlacklistModel.findOne({token:{$in:[token]} });
        if (blacked) {
            res.status(400).send("Login again")
        }
        const isValid = jwt.verify(token, "secret");
        if (!isValid) {
            res.status(400).send("Not authorized")
        }
        //console.log(isValid)
        req.body.UserID = isValid.UserID
        return next();
    } catch (err) {
        res.status(400).send(err.message)
    }
}

module.exports = auth