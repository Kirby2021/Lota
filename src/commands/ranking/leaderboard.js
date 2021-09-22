const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)
const guilds = require("../../schemas/guild")

module.exports = {
    name: "leaderboard",
    description: "See the servers level leader board",
    category: "Ranking",
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
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.leveling) {
            let members = []
            message.guild.members.cache.forEach(async (m) => {
                const user = await users.findOne({guildId: message.guild.id, userId: m.id})
                if(user) {
                   if(user.level >= 0) {
                    members.push({
                        level: user.level,
                        user: m.id,
                    })
                   }
                }
            })
            message.reply({content: `${client.custom_emojis.warning} • Generating levels`}).then((msg) => {
                
                setTimeout(() => {
                    let top10 = []
                    let pos = 1
                    members.sort((a, b) => b.level - a.level).forEach((m) => {
                        const mem = message.guild.members.cache.find(x => x.id === m.user)
                        top10.push(`**#${pos++})** ${mem} • ${m.level}`)
                    })

                    msg.edit({content: `${client.custom_emojis.tick} • Report generated!`})
                    
                    const embed = new MessageEmbed()
                    .setAuthor(`${message.guild.name}'s ranking leaderboard! (Top 10)`, message.guild.iconURL({dynamic: true}))
                    .setDescription(top10.join("\n"))
                    .setFooter(`Only shows top 10 members!`)
                    .setColor(client.colors.pink)
    
                    return msg.channel.send({embeds: [embed]})
                }, 2000);
             

            })
            
        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Server levels are not enabled!`})
        }
    }
}