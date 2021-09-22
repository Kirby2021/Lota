const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "say",
    description: "Say a message",
    category: "Utils",
    // owner: true,
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
        if(message.member.roles.first()) {
            return message.reply({content: `${client.custom_emojis.cross} • Please do not mention roles in your message!`})
        } else {
            message.channel.send({content: `${args.join(" ")}`})
            message.delete().catch(() => {})
        }

    }
}