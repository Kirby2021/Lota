
const users = require(`../schemas/users`)
const { Client, MessageEmbed, Message } = require('discord.js')
/**
 * 
 * @param {Client} client
 * @param {Message} message
 */

module.exports = async (message) => {
    if(message.author.bot) return;
    const member = message.mentions.members.first() || message.member
    if(member) {
        const user = await users.findOne({userId: member.id})
        if(user) {
            if(user.afk) {
                if(message.author.id === member.id) {
                    await users.findOneAndUpdate({userId: member.id}, {
                        afk: false,
                        afk_reason: "None",
                        afk_set: Date.now()
                    })
                    return message.reply({content: `Welcome back ${member} i have removed your afk!`})
                } else {
                    return message.reply({content: `${member} is currently afk! <t:${Math.floor(user.afk_set / 1000)}:R>`})
                }
            }
        }
    }
}