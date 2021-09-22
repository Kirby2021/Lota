const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "poke",
    description: "poke someone!",
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
            message.reply({content: `${client.custom_emojis.cross} • Please supply a member you would like to poke!`})
        }
        if(member.id === message.author.id) {
            message.reply({content: `${client.custom_emojis.warning} • You can not poke yourself!`})
        }
        let img = await client.neko_life.sfw.kiss()
        const embed = new MessageEmbed()
        .setAuthor(`**${message.author.username}** poked **${member.user.username}**!`)
        .setImage(img.url)
        .setColor(client.colors.pink)

        return message.reply({embeds: [embed]})
    }
}