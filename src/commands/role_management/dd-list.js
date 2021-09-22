const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "dd-list",
    description: "See all dropdown roles!",
    category: "role_management",
    // owner: true,
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.dropdownRoles.length <= 0) {
            return message.reply({content: `${client.custom_emojis.cross} • This server has no dropdown roles setup!`})
        } else {
            let arr = []
            let pos = 0
            guild.dropdownRoles.forEach((dd) => {
                arr.push(` > **#${pos++})** \`${dd.id}\` • [\`Jump\`](https://discordapp.com/channels/${message.guild.id}/${dd.chanId}/${dd.msgId})  `)
            })
            const embed = new MessageEmbed()
            .setDescription(arr.join("\n"))
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        }
    }
} 