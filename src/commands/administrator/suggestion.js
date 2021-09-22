const { Client, Message, MessageEmbed } = require("discord.js")
const suggestions = require(`../../functions/suggestions`)

module.exports = {
    name: "suggestion",
    description: "Deny / Accpet / Await a suggestion",
    category: "Administrator",
    // owner: true,
    aliases: ["suggest"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args, {guild}) => {
        if(!guild.suggestions) {
            return message.reply({content: `${client.custom_emojis.cross} • Please setup suggestions before using this command!`})
        }


        let validTypes = ["accept","deny","await"]
        if(!args.length || !validTypes.includes(args[0].toLowerCase())) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid type! \`${validTypes.join("`, `")}\``})
        }

        if(args[0].toLowerCase() === "accept") {
            let [type, id, ...reason] = args
            if(!id) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a message ID!`})
            }
            let re = reason.join(" ") || "No reason"
            suggestions.accept(message, client, id, re)
        }
        if(args[0].toLowerCase() === "deny") {
            let [type, id, ...reason] = args
            if(!id) {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a message ID!`})
            }
            let re = reason.join(" ") || "No reason"
            suggestions.deny(message, client, id, re)
        }
        if(args[0].toLowerCase() === "await") {
            let [type, id, ...reason] = args  
            suggestions.await(message, client, id)
        }

    }
}