const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "mixnames",
    description: "Mix 2 names together",
    category: "Fun",
    // owner: true,
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
        const arg = args.join(" ").split(" ? ")
        const member1 = message.mentions.members.first() ||
        message.guild.members.cache.find(m => m.id === arg[0] || m.user.username.toLowerCase() === arg[0].toLowerCase())
        const member2 = message.mentions.members.first() ||
        message.guild.members.cache.find(m => m.id === arg[1] || m.user.username.toLowerCase() === arg[1].toLowerCase())
        if(!member1 || !member2) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply 2 valid members split by a \` ? \`!`})
        }
        let name = `${member1.user.username.split("").slice(0, (member1.user.username.length / 2 )).join("")}${member2.user.username.split("").slice(0, (member2.user.username.length / 2 )).join("")}`
        message.reply({content: `${client.custom_emojis.tick} • ${name}`})
    }
}