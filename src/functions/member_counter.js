
const guilds = require(`../schemas/guild`)
const { Message, Client } = require('discord.js')

/**
 * 
 * @param {Client} client
 */
module.exports = async (client) => {
        client.guilds.cache.forEach(async (g) => {
            setTimeout(async () => {
                const guild = await guilds.findOne({guildId: g.id})
                if(guild.member_counter) {
                    const channel = g.channels.cache.find(c => c.id === guild.member_counter_channel && c.type === guild.member_counter_channel_type)
                    if(!channel) return;
                    channel.setName(`${guild.member_counter_channel_name}${g.memberCount}`)
                }
            }, 3000);
        })
}