const { Client, Message, MessageEmbed, Util } = require("discord.js")
module.exports = {
    name: "emojiinfo",
    description: "See information on a emoji!",
    category: "Information",
    aliases: ["ei"],
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
                .setAuthor(parsedEmoji.name, client.user.displayAvatarURL())
                .addFields(
                    {name: "Name & ID", value: `${ parsedEmoji.name } (\`${parsedEmoji.id}\`)`},
                    {name: "Url", value: `[Here](${url})`},
                    {name: "Animated", value: `${client.utils.formatString(String(parsedEmoji.animated))}`},
                )
                .setThumbnail(url)
                .setColor(client.colors.pink)
                .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

                return message.reply({embeds: [embed]})
            } else {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
            }
        }
    }
}