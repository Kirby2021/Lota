const { Client, Message, MessageEmbed, Util } = require("discord.js")
module.exports = {
    name: "enlarge",
    description: "Enlarge an emoji!",
    category: "Information",
    //aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(!args.length) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
        }
        for(const emoji of args) {
            const parsedEmoji = Util.parseEmoji(emoji)
            
            if(parsedEmoji) {
                const ex = parsedEmoji.animated ? ".gif" : ".png"
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + ex}`
                const embed = new MessageEmbed()
                .setAuthor(`Enlarged ${parsedEmoji.name}`, client.user.displayAvatarURL())
                .setImage(url)
                .setColor(client.colors.pink)
                .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

                return message.reply({embeds: [embed]})
            } else {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
            }
        }
    }
}