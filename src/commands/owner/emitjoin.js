const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "emitjoin",
    description: "Emit the join event",
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
        client.emit("guildMemberAdd", message.member)
        message.reply({content: `${client.custom_emojis.tick} • Done!`})
    }
}