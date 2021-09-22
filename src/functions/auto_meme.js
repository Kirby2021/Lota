

const guilds = require(`../schemas/guild`)
const { Client, MessageEmbed } = require('discord.js')
const fetch = require("node-fetch")
/**
 * 
 * @param {Client} client
 */
module.exports = async (client) => {
   
        let subreddits = ["dankmemer","memes","meme"]
        const reddit = subreddits[Math.floor(Math.random() * subreddits.length)]
        const data = await fetch(`https://meme-api.herokuapp.com/gimme/${reddit}`).then(res => res.json())
        if(!data) return;
        const { title, url, postLink, nsfw, subreddit } = data
        const embed = new MessageEmbed()
        .setDescription(`**[${title}](${postLink})**`)
        .setImage(url)
        .setFooter(`Reddit: ${subreddit}`)
        .setColor("RANDOM")

        client.guilds.cache.forEach( async (g) => {
            const guild = await guilds.findOne({guildId: g.id})
            if(guild) {
                if(!guild.auto_meme) return;
                const channel = g.channels.cache.find(c => c.id === guild.auto_meme_channel)
                if(!channel) return;
                if(nsfw) {
                    if(!channel.nsfw) return;
                    channel.send({embeds: [embed]})
                } else {
                    channel.send({embeds: [embed]})
                }
            }
            
        })
}