const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
let invite_link = "https://discord.com/api/oauth2/authorize?client_id=885567488761397338&permissions=8&scope=bot"
let support_link = "https://discord.gg/YTPGywHj9d"
module.exports = {
    name: "links",
    description: "See all of lotas links",
    category: "Utils",
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
        const embed = new MessageEmbed()
        .setAuthor(`Lota's Links!`, client.user.displayAvatarURL())
        .setDescription(`All useful links can be found below!`)
        .setColor(client.colors.pink)

        const row = new MessageActionRow()
        .addComponents([
            new MessageButton() .setURL(invite_link) .setLabel("Invite") .setStyle("LINK"),
            new MessageButton() .setURL(support_link) .setLabel("Support") .setStyle("LINK")
        ])

        message.reply({embeds: [embed], components: [row]})
    }
}