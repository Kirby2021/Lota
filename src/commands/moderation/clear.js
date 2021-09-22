const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "clear",
    description: "Clear messages in a chat",
    category: "Moderation",
    aliases: ["purge"],
    // usages: [],
    botPermissions: ["MANAGE_MESSAGES"],
    userPermissions: ["MANAGE_MESSAGES"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let message_amount = args[0]
        if(isNaN(message_amount)) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid number!`})
        }

        if(message_amount >= 101) {
            message_amount = 100
        }

        message.channel.bulkDelete(message_amount, true)
        .then((msgs) => {
            return message.channel.send({content: `${client.custom_emojis.tick} • I have cleared ${msgs.size}/${message_amount} messages!`})
        }).catch((er) => {
            return message.channel.send({content: `${client.custom_emojis.warning} • There was an error clearing these messages!!`})
        })
    }
}