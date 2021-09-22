const { Message, Client, MessageEmbed, Channel } = require('discord.js')
const guilds = require(`../schemas/guild`)
const users = require(`../schemas/users`)


/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Channel} channel
 */
module.exports = async (message, client) => {
 
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(guild.leveling) {
        const amount = Math.floor(Math.random() * 19) + 1

        const user = await users.findOne({userId: message.author.id, guildId: message.guild.id})
        await users.findOneAndUpdate({userId: message.author.id, guildId: message.guild.id}, {
            xp: Number(user.xp) + amount
        })
        const user3 = await users.findOne({userId: message.author.id, guildId: message.guild.id})


        if(guild.leveling_roles.length > 0) {
            guild.leveling_roles.map((l) => {
                if(l.level <= user3.level) {
                    message.member.roles.add(l.id).catch(() => {
                        message.channel.send({content: `Failed to give you your level role! Please report this to an admin!`})
                    })
                }
                if(l.level > user3.level) {
                    message.member.roles.remove(l.id).catch(() => {
                        message.channel.send({content: `Failed to give you your level role! Please report this to an admin!`})
                    })
                }
            })
        } 
        if(user3.xp >= user.requiredXp) {
            await users.findOneAndUpdate({userId: message.author.id, guildId: message.guild.id}, {
                level: Number(user.level) + 1,
                requiredXp: Number(user.requiredXp) * 1.5
            })
            const user2 = await users.findOne({userId: message.author.id, guildId: message.guild.id})

            
            function format(msg) {
                let text = msg;
            
               const terms = [
                 { name: '{{user#mention}}', value: `<@${message.author.id}>` },
                 { name: '{{user#tag}}', value: `${message.author.tag}` },
                 { name: '{{user#id}}', value: `${message.author.id}` },
                 { name: '{{server#id}}', value: `${message.guild.id}` },
                 { name: '{{server#name}}', value: `${message.guild.name}` },
                 { name: '{{server#membercount}}', value: `${message.guild.membercount}` },
                 { name: '{{level}}', value: `${user2.level}`},
                 { name: '{{xp}}', value: `${user2.xp}`},
                 { name: '{{requiredXp}}', value: `${user2.requiredXp}`},
               ];
               
               for (let { name, value } of terms) text = text.replace(new RegExp(name, 'igm'), value);
               
               return text
               }

            if(guild.leveling_channel === "message") {
                return message.reply({content: `${format(guild.leveling_message)}`})
            } else {
                const channel = message.guild.channels.cache.find(c => c.id === guild.leveling_channel)
                if(!channel) {
                    return message.reply({content: `${format(guild.leveling_message)}`})
                } else {
                    return channel.send({content: `${format(guild.leveling_message)}`})
                }
            }
        }
    }
}
