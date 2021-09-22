const { Client, Message, MessageEmbed } = require("discord.js")
const ms = require("ms")
module.exports = {
    name: "slowmode",
    description: "Set the current channels slowmode",
    category: "Moderation",
    aliases: ["sm"],
    // usages: [],
    botPermissions: ["MANAGE_CHANNELS"],
    userPermissions: ["MANAGE_CHANNELS"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const arg = args[0].split("")
        let amount_to_set = arg[arg.length - 2]
        let amount = arg.join("")
        console.log(amount)
        if(isNaN(amount_to_set)) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid number!`})
        }
        if(!amount.endsWith("s") && !amount.endsWith("m") && !amount.endsWith("h")) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid number! (E.G \`10s\`)`})
        }
       
        if((ms(amount) / 1000 ) >= 21600) {
            return message.reply({content: `${client.custom_emojis.cross} • Time must be less than 6 hours!`})
        }
        
        message.channel.setRateLimitPerUser(ms(amount) / 1000)
        .then(() => {
            return message.reply({content: `${client.custom_emojis.tick} • Channels slowmode has now been set to \`${amount}\``})
        })
        .catch((err) => {
            console.log(err)
            return message.reply({content: `${client.custom_emojis.cross} • There was an error setting the slowmode in this channel!`})
        })
    }
}