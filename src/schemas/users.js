const { model, Schema } = require("mongoose")

const schema = new Schema({
    // General
    userId: String,
    guildId: String,
    staff: {type: Boolean, default: false},

    // Mod
    warns: {type: Array, default: []},

    // Leveling
    level: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    requiredXp: {type: Number, default: 1000},


    // Economy
    coins: {type: Number, default: 0},
    credits: {type: Number, default: 0},
    items: {type: Array, default: []},
    workers: {type: Array, default: []},
    transactions: {type: Array, default: []},


    // Afk
    afk: {type: Boolean, default: false},
    afk_reason: String,
    afk_set: String
})

module.exports = model("Users", schema)