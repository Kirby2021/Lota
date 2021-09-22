const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "leveling-removeautorole",
    description: "Remove an auto role to leveling",
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
        const [level, ...roles] = args
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.leveling_roles.length <= 0) {
            return message.reply({content: `${client.custom_emojis.cross} • Please add some level auto roles first!`})
        
        }
        if(!level) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply the valid arguments! (\`${prefix}level-removeautorole <level>\`)`})
        }
        if(!level) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a level!`})
        }
        let valid = false
        let index 
        let roleId
        guild.leveling_roles.forEach((r) => {
            if(r.level === level) {
                roleId = r.id
                valid = true
                index = guild.leveling_roles.indexOf(r)
            }
        })
        let role = message.guild.roles.cache.find(r => r.id === roleId)
        if(valid) {
            guild.leveling_roles.splice(index, 1)
            guild.save()
            return message.reply({content: `${client.custom_emojis.tick} • Removed! now at level \`${level}\` you will not get **${role.name}** role!`})
        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid leveling auto role!`})
        }
       

    }
}