const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "replace",
    description: "Clone a channel and delete the old one.",
    category: "Moderation",
    // owner: true,
    aliases: ["clone","nuke"],
    // usages: [],
    botPermissions: ["MANAGE_CHANNELS"],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const channel = 
        message.mentions.channels.first() ||
        message.guild.channels.cache.find(c => c.id === args.join(" ") || c.name.toLowerCase() === args.join(" ").toLowerCase()) ||
        message.channel

        const newChannel = await channel.clone()
        channel.delete()
        newChannel.send({content: `${client.custom_emojis.tick} • I have cloned #${channel.name}!`})
        newChannel.send({content: `<@${message.author.id}>`}).then((m) => {
            setTimeout(() => {
                m.delete()
            }, 100);
        })
    }
}