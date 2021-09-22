const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "serverinfo",
    description: "See information on the current server.",
    category: "Information",
    aliases: ["si"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const icon = message.guild.iconURL({dynamic: true})
        const banner = message.guild.bannerURL({dynamic: true, size: 1024})

        let features = []
        message.guild.features.forEach((f) => {
            features.push(client.utils.formatUnderlines(f))
        })
        if(features.length <= 0) {
            features.push("No features")
        }
        const embed = new MessageEmbed()
        .setAuthor(message.guild.name, icon)
        .setThumbnail(icon)
        .setImage(banner)
        .addFields(
            {name: `Owner`, value: `<@${message.guild.ownerId}> (\`${message.guild.ownerId}\`)`},
            {name: `Created`, value: `<t:${Math.floor(message.guild.createdTimestamp / 1000)}:D>`},
            {name: "Boost Status", value: `${message.guild.premiumSubscriptionCount}/30 (${client.utils.formatUnderlines(message.guild.premiumTier)})`},
            {name: "Members", value: `Humans: **${message.guild.members.cache.filter(m => !m.user.bot).size}** | Bots: **${message.guild.members.cache.filter(m => m.user.bot).size}** | Total: **${message.guild.memberCount}**`},
            {name: `Channels`, value: `Text: **${message.guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size}** | Voice: **${message.guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}** | Stage: **${message.guild.channels.cache.filter(c => c.type === "GUILD_STAGE_VOICE").size}** | Total: **${message.guild.channels.cache.size}**`},
            {name: `Features`, value: `${features.join(", ")}`}
        )
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        message.reply({embeds: [embed]})
    }
}