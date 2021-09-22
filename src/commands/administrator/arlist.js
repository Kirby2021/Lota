const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")
module.exports = {
    name: "ar-list",
    description: "List all auto responders",
    category: "Administrator",
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    //userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})

        if(guild.auto_responders.length <=0) {
            return message.reply({content: `${client.custom_emojis.cross} • This server doesnt have any auto responders!`})
        }

        const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name}'s Auto responsers!`)
        .setDescription(`\`${guild.auto_responders.map((c) => `${c.trigger}`).join("`, `")}\``)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
    }
}