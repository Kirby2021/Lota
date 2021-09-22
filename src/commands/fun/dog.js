const { Client, Message, MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
module.exports = {
    name: "dog",
    description: "Get a cute dogo picture and information",
    category: "Fun",
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
        fetch("https://api.thedogapi.com/v1/images/search")
        .then((res) => res.json())
        .then((json) => {
            const embed = new MessageEmbed()
            .setAuthor(`Dogo picture 🐶`, client.user.displayAvatarURL())
            .addFields(
                {name: "Name / Breed", value: `${json[0].breeds[0].name}`, inline: true},
                {name: "Bred for", value: `${json[0].breeds[0].bred_for}`, inline: true},
                {name: "Life span", value: `${json[0].breeds[0].life_span}`}
            )
            .setImage(json[0].url)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        })
    }
}