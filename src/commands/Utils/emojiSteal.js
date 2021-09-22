const { Client, Message, MessageEmbed, Util } = require("discord.js")

module.exports = {
    name: "emojisteal",
    description: "Steal emojis and add them to your server!",
    category: "Utils",
    aliases: ["stealemoji"],
    // usages: [],
    botPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    userPermissions: ["MANAGE_EMOJIS_AND_STICKERS"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let maxLength 
        if(message.guild.premiumTier === "NONE") {
            maxLength = 50
        }
        if(message.guild.premiumTier === "TIER_1") {
            maxLength = 100
        }
        if(message.guild.premiumTier === "TIER_2") {
            maxLength = 150
        }
        if(message.guild.premiumTier === "TIER_3") {
            maxLength = 250
        }
        if(!args.length || args.length >= 30) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
        }
        
        if(message.guild.emojis.cache.size > maxLength) {
            return message.reply({content: `${client.custom_emojis.cross} • This guild is at its emoji cap!`})
        }

        let addedEmojis = []
        for(const rawemoji of args) {
            const parsedEmoji = Util.parseEmoji(rawemoji)

            if(parsedEmoji.id) {
                const ex = parsedEmoji.animated ? ".gif" : ".png"
                const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + ex}`
                message.guild.emojis.create(url, parsedEmoji.name).then((e) => {
                    addedEmojis.push(`Added ${e} • \`${message.guild.emojis.cache.find(x => x.id === e.id)}\``)
                })
            } else {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
            }
        }

        setTimeout(() => {
            const embed = new MessageEmbed()
        .setAuthor(`Emojis added!`, client.user.displayAvatarURL())
        .setColor(client.colors.pink)
        .setDescription(`Added ${addedEmojis.length} emoji(s) to ${message.guild.name}!`)
        .addFields({name: "Emojis", value: `${addedEmojis.join("\n")}`})
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
        }, 2000);
    }
}