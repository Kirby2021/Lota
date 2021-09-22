const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "membercount",
    description: "See the servers member count!",
    category: "Information",
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
        return message.reply({content: `**${message.guild.name}** has **${message.guild.memberCount}** members!`})
    }
}