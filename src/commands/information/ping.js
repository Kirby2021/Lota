const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "ping",
    description: "See the bots ping",
    category: "Information",
    aliases: ["pong"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let pingEmoji 
        let date = Date.now()
        message.reply({content: `${client.custom_emojis.warning} • Pinging...`}).then((msg) => {
            if(client.ws.ping > 100 ) {
                pingEmoji = `${client.custom_emojis.bad_ping}`
            }
            if(client.ws.ping <= 100 ) {
                pingEmoji = `${client.custom_emojis.idel_ping}`
            }
            if(client.ws.ping <= 50) {
                pingEmoji = `${client.custom_emojis.good_ping}`
            }
            
            msg.edit({content: `${pingEmoji} • **${client.ws.ping}ms** `})
        })
    }
}