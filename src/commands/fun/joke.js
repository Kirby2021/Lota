const { Client, Message, MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')
module.exports = {
    name: "joke",
    description: "Get a random joke!",
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
        const data = await fetch(`https://sv443.net/jokeapi/v2/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist`).then(res => res.json())
      if (!data) return message.reply({content: `${client.custom_emojis.cross} • Could not get joke!`})
      const { type, category, joke, setup, delivery } = data
      message.reply({content: `**${client.utils.formatUnderlines(category)} joke!**\n${type === "twopart" ? `${setup}\n||${delivery}||` : joke}`})

    }
}