const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)
const guilds = require("../../schemas/guild")

module.exports = {
    name: "resetalllevels",
    description: "Reset all user levels",
    category: "Ranking",
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
        if(guild.leveling) {
            message.reply({content: `${client.custom_emojis.warning} • Resetting all user levels.`}).then((msg) => {
                message.guild.members.cache.forEach(async (m) => {
                    const user = await users.findOne({userId: m.id, guildId: message.guild.id})
                    if(user) {
                        await users.findOneAndUpdate({userId: m.id, guildId: message.guild.id}, {
                            level: 0,
                            xp: 0,
                            requiredXp: 1000,
                        })
                    }
                })
                return msg.edit({content: `${client.custom_emojis.tick} • All user levels have been reset!`})
            })
            
        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please setup leveling before using this command!`})
        }
    }
}