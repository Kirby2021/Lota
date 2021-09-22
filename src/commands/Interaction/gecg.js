const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "gecg",
    description: "Get a gecg (genetically engineered catgirl) image",
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
        let img = await client.neko_life.sfw.gecg()
        const embed = new MessageEmbed()
        .setImage(img.url)
        .setColor(client.colors.pink)

        return message.reply({embeds: [embed]})
    }
}