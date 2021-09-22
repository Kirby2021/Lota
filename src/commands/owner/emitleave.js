const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "emitleave",
    description: "Emit the leave event",
    category: "Owner",
    owner: true,
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
        client.emit("guildMemberRemove", message.member)
        message.reply({content: `${client.custom_emojis.tick} • Done!`})
    }
}