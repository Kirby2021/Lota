const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "tickle",
    description: "tickle someone!",
    category: "Interaction",
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
        let member = message.mentions.members.first() ||
        message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase())
        if(!member) {
            message.reply({content: `${client.custom_emojis.cross} • Please supply a member you would like to tickle!`})
        }
        if(member.id === message.author.id) {
            message.reply({content: `${client.custom_emojis.warning} • You can not tickle yourself!`})
        }
        let img = await client.neko_life.sfw.kiss()
        const embed = new MessageEmbed()
        .setAuthor(`**${message.author.username}** is tickling **${member.user.username}**!`)
        .setImage(img.url)
        .setColor(client.colors.pink)

        return message.reply({embeds: [embed]})
    }
}