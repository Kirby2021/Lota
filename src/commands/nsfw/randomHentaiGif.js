const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "randomhentaigif",
    description: " (NSFW API)",
    category: "nsfw",
    // owner: true,
    aliases: ["rhg","rhentaigif"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let img = await client.neko_life.nsfw.randomHentaiGif()
        const embed = new MessageEmbed()
        .setDescription(`NSFW!`)
        .setImage(img.url)
        .setColor(client.colors.pink)

        return message.reply({embeds: [embed]})
    }
}