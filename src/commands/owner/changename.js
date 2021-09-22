const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "changename",
    description: "Change the bots name",
    category: "Owner",
    owner: true,
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
        if(!args.join(" ")) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a new name!`})
        }
        if(!args.length >= 32) {
            return message.reply({content: `${client.custom_emojis.cross} • Name must be below 32 charaters!`})
        }
       client.user.setUsername(args.join(" ")) 
    }
}