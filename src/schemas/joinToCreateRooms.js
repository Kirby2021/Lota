const { model, Schema } = require("mongoose")

const schema = new Schema({
    userId: String,
    guildId: String,
    roomId: String,
    locked: {type: Boolean, default: false},
    bannedUsers: {type: Array, default: []},
    privateNomic: String,
    muted: {type: Array, default: []},
})

module.exports = model("JoinToCreateRooms", schema)