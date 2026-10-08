const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token : {
        type: String,
        required : [true, "token is required for blacklisting"]
    }
}, {
    timestamps : true //tracks the time of blacklisting
})

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel