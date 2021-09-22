const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js")
const canvacord = require('canvacord')
module.exports = {
    name: "beautiful",
    description: "Beautify a pfp",
    category: "Fun",
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
        message.reply({content: `${client.custom_emojis.warning} • Editing photo...`}).then(async (msg) => {
        let member = message.mentions.channels.first() || message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        const av = member.user.displayAvatarURL({dynamic: false, format: "png"})
        const img = await canvacord.Canvas.beautiful(av)
        const attachment = new MessageAttachment(img, "Edited_photo.png")
        msg.edit({ content: `${client.custom_emojis.tick} • Photo rendered!`,files: [attachment]})
        })
        

        
    }
}