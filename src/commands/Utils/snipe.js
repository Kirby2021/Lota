const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")
module.exports = {
    name: "snipe",
    description: "See the last deleted message in the whole server!",
    category: "Utils",
    aliases: ["snip"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.snipe_message.length <= 0) {
            return message.reply({content: `${client.custom_emojis.cross} • There is nothing to snipe!`})
        }
        
        const embed = new MessageEmbed()
        .setAuthor(`${guild.snipe_message[0].author}`, guild.snipe_message[0].avatar)
        .setColor(client.colors.pink)
        .setDescription(`${guild.snipe_message[0].content}`)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
    }
}