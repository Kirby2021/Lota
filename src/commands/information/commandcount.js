const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "commandcount",
    description: "See how many commands there are!",
    category: "Information",
    aliases: ["cmdcount"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let total = 0
        client.commands.each((c) => total++)
        message.reply({content: `<:icons_serverinsight:886353742818054234> • There are currently **${total}** commands!`})
    }
}