const { Client, Message, MessageEmbed } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "autonick",
    description: "Auto nick members on join!",
    category: "Administrator",
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
        if(!args.length || args.length >= 32) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a nickname! (FYI: Set the nickname as "none" if you want it to be disabled)`})
        }
        await guilds.findOneAndUpdate({guildId: message.guild.id}, {
            auto_nick: args.join(" ")
        })

        return message.reply({content: `${client.custom_emojis.tick} • Auto nick has been set! Current value: ${args.join(" ")}`})

    }
}