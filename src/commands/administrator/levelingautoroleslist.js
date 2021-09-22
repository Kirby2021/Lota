const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "leveling-autorolelist",
    description: "List all auto role for leveling",
    category: "administrator",
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
    run: async(client, message, args, {prefix}) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.leveling_roles.length <= 0) {
            return message.reply({content: `${client.custom_emojis.cross} • Please add some level auto roles first!`})
        }
       
        let roles = []
        guild.leveling_roles.forEach((r) => {
            const role = message.guild.roles.cache.find(x => x.id === r.id)
            roles.push(`${role} • \`${r.level}\``)
        })

        const embed = new MessageEmbed()
        .setAuthor(`Automatic Level Roles`)
        .setDescription(roles.join("\n"))
        .setColor(client.colors.pink)

        return message.reply({embeds: [embed]})
       

    }
}