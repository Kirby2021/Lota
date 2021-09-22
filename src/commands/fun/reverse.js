const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "reverse",
    description: "reverse your text!",
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
        if(!args.length) return message.reply({content: `${client.custom_emojis.cross} • Please supply some text!`})
        message.reply({content: `<:icons_loop:886278015863107614> • ${args.join(" ").split("").reverse().join("")}`})
    }
}