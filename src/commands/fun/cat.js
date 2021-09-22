const { Client, Message, MessageEmbed } = require("discord.js")
const fetch = require("node-fetch")
require('dotenv').config()
module.exports = {
    name: "cat",
    description: "Get a cute cat picture and information",
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
        fetch("https://api.thecatapi.com/v1/breeds", {
            method: 'GET',
            headers: {
                "X-API-KEY": process.env.cat_api_key
            }
        })
        .then((res) => res.json())
        .then((json) => {
            let json_length = json.length
            const index = Math.floor(Math.random() * json_length)
            let image = json[index]
            const embed = new MessageEmbed()
            .setAuthor(`Cat picture 😺`, client.user.displayAvatarURL())
            .addFields(
                {name: "Name / Breed", value: `${image.name}`, inline: true},
                {name: "Origin", value: `${image.origin}`, inline: true},
                {name: "Life span", value: `${image.life_span}`}
            )
            .setImage(image.image.url)
            .setColor(client.colors.pink)

            return message.reply({embeds: [embed]})
        })
    }
}