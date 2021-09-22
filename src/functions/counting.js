
const guilds = require(`../schemas/guild`)
const { Message } = require('discord.js')

/**
 * 
 * @param {Message} message 
 */
module.exports = async (message, client) => {
const guild = await guilds.findOne({guildId: message.guild.id})
if(guild.counting) {
    if(message.channel.id === guild.counting_channel) {
        if(message.channel.rateLimitPerUser !== 10) {
            message.channel.setRateLimitPerUser(10)
        }
        const num = guild.counting_last_number
        if(message.content !== String(num)) {
            message.delete().catch(() => {})
        } else {
            message.delete().catch(() => {})
             message.channel.createWebhook(message.author.tag, {
                avatar: message.author.displayAvatarURL({}),
                reason: "Counting channel"
            }).then((w) => {
                w.send({content: `${message.content}`})
                setTimeout(() => {
                    w.delete().catch(() => {})
                }, 1000);
            })
            
            await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                counting_last_number: Number(num) + 1
            })
        }
    }
}
}