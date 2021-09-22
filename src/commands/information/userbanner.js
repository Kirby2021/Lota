const { Client, Message, MessageEmbed } = require("discord.js")
const axios = require('axios')
require("dotenv").config()
module.exports = {
    name: "userbanner",
    description: "See a users banner",
    category: "Information",
    aliases: ["ubanner"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let member = message.mentions.channels.first() || message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        axios.get(`https://discord.com/api/users/${member.id}`, {
            headers: {
                Authorization: `Bot ${process.env.token}`
            }
        })
        .then((res) => {
            const { banner, accent_color } = res.data
            if(!banner || !accent_color) {
                return message.reply({content: `${client.custom_emojis.cross} • This user doesnt have a banner or accent color!`})
            }
            if(banner) {
                let ex = banner.startsWith("a_") ? ".gif" : ".png"
                const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${ex}?size=4096`
                
                const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}'s banner!`, member.user.displayAvatarURL({dynamic: true}))
                .setImage(url)
                .setColor(client.colors.pink)
                .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())
                return message.reply({embeds: [embed]})
            } else {
               if(accent_color) {
                const embed = new MessageEmbed()
                .setAuthor(`${member.user.username}'s accent color!`, member.user.displayAvatarURL({dynamic: true}))
                .setImage(`https://singlecolorimage.com/get/${accent_color.slice(1)}/400x400`)
                .setColor(client.colors.pink)
                .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

                return message.reply({embeds: [embed]})
               }
            }
        })

    }
}