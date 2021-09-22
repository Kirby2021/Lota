const { Client, Message, MessageEmbed } = require("discord.js")
const specialCodes = {
    '0': ':zero:',
    '1': ':one:',
    '2': ':two:',
    '3': ':three:',
    '4': ':four:',
    '5': ':five:',
    '6': ':six:',
    '7': ':seven:',
    '8': ':eight:',
    '9': ':nine:',
    '#': ':hash:',
    '*': ':asterisk:',
    '?': ':grey_question:',
    '!': ':grey_exclamation:',
    ' ': '   '
  }

  
module.exports = {
    name: "emojify",
    description: "Emojify your text!",
    category: "Fun",
    aliases: ["emotify"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        if(!args.length) return message.reply({content: `${client.custom_emojis.cross} • Please supply some text!`})
        const msgs = args.join(" ").split("").map((msg) => {
            if(/[a-z]/g.test(msg)) {
                return `:regional_indicator_${msg}:`
            } else if(specialCodes[msg]) {
                return specialCodes[msg]
            }
            return msg
        }).join('').replace(/,/g, '     ')

        message.reply({content: `${msgs}`})
    }
}