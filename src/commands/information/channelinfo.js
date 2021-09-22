const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "channelinfo",
    description: "See information about a channel",
    category: "Information",
    aliases: ["ci"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let channel = message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id === args.join(" ") || c.name.toLowerCase() === args.join(" ").toLowerCase()) ||
        message.channel
        const embed = new MessageEmbed()
        .setAuthor(channel.name, client.user.displayAvatarURL())
        .addFields(
            {name: "Mention & ID", value: `<#${channel.id}> (\`${channel.id}\`)`},
            {name: "Position", value: `${channel.rawPosition}`},
            {name: "NSFW", value: `${channel.nsfw}`},
            {name: "Type", value: `${client.utils.formatUnderlines(channel.type)}`},
            {name: "Topic", value: `${channel.topic ? channel.topic : "No topic"}`}
        )
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

                return message.reply({embeds: [embed]})
    } 
}