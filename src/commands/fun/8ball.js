const { Client, Message, MessageEmbed } = require("discord.js")
let responses = [
    "yes",
    "no",
    "maybe",
    "its a possibility",
    "possible",
    "defently",
    "absolutely",
    "absolutely not",
    "next question",
]
module.exports = {
    name: "8ball",
    description: "Get an awnser to your question",
    category: "Fun",
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(!args.length) return message.reply({content: `${client.custom_emojis.cross} • Please supply a question!`})
        message.reply({content: `${responses[Math.floor(Math.random() * responses.length)]}`})
    }
}