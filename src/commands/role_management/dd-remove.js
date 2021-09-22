const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "dd-remove",
    description: "Remove a dropdown role!",
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
            if(!args.length) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid dropdown role's ID!`})
            }
            let value;
            let dropdown;
            let dd_values
            guild.dropdownRoles.forEach((dd) => {
                console.log(dd)
                if(dd.id === args[0]) {
                    value = true
                    dropdown = guild.dropdownRoles.indexOf(dd);
                    dd_values = dd.msgId
                    return;
                }
            })
 
            if(!value) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid dropdown role's ID!`})
            }
            const channel = message.guild.channels.cache.find(c => c.id === dd_values.chanId)
            if(channel) {
                const msg = await channel.messages.fetch(dd_values)
                if(msg) {
                    msg.delete().catch(() => {})
                    return;
                } else {
                    return;
                }
            }
            guild.dropdownRoles.splice(dropdown, 1)
            guild.save()

            const embed = new MessageEmbed()
            .setDescription(` > ${client.custom_emojis.tick} • Removed dropdown \`${args.join(" ")}\``)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        
        }
    }
}