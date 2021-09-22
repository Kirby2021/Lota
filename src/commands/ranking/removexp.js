const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)
const guilds = require("../../schemas/guild")

module.exports = {
    name: "removexp",
    description: "Remove an amount of xp from member!",
    category: "Ranking",
    // owner: true,
    aliases: ["xpremove"],
    usages: ["<member> ? <level>"],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        const arg = args.join(" ").split(" ? ")
        if(guild.leveling) {
            const member = message.mentions.members.first() ||
            message.guild.members.cache.find(m => m.id === arg[0] || m.user.username.toLowerCase() === arg[0].toLowerCase())
            if(!member) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid member!`})
            }
            const user = await users.findOne({userId: member.id, guildId: message.guild.id})
            if(!user) {
                return message.reply({content: `${client.custom_emojis.cross} • This user has no levels saved!`})
            }
            if(!arg[1]) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply an amount of xp!`})
            }
            if(isNaN(arg[1])) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid level amount!`})
            }
            await users.findOneAndUpdate({userId: member.id, guildId: message.guild.id}, {
                xp: Number(user.xp) - parseInt(arg[1])
            })
            return message.reply({content: `${client.custom_emojis.tick} • ${member} has been stripped of ${arg[1]} xp!`})

        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please setup leveling before using this command!`})
        }
        
    }
}