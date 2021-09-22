const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")
module.exports = {
    name: "cc-list",
    description: "List all custom commands",
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

        if(guild.custom_commands.length <=0) {
            return message.reply({content: `${client.custom_emojis.cross} • This server doesnt have any custom commands!`})
        }

        const embed = new MessageEmbed()
        .setAuthor(`${message.guild.name}'s Custom commands!`)
        .setDescription(`\`${guild.custom_commands.map((c) => `${c.trigger}`).join("`, `")}\``)
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
    }
}