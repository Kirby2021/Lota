const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "setup-logging",
    description: "Setup server logging",
    category: "Settings",
    // owner: true,
    aliases: ["setup-log","setup-logs"],
    // usages: [],
    //botPermissions: ["MANAGE_ROLES"],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const step1 = new MessageEmbed()
        .setTitle(`Logging [1]`, client.user.displayAvatarURL())
        .setDescription(`Would you like to enable or disabled the feature? Types: \`disable\`,\`enable\``)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step2 = new MessageEmbed()
        .setTitle(`Logging [2]`, client.user.displayAvatarURL())
        .setDescription(`What should the logging channel be?`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

       
        let steps = [step1, step2]
        let counter = 0
        let hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const finalData = {
            value: undefined,
            channel: undefined,
        }
        const collector = new MessageCollector(message.channel)

        collector.on("collect", (msg) => {
            if(msg.author.id !== message.author.id) return;
            if(msg.content.toLowerCase() === "cancel") {
                collector.stop("0")
                hoisterMessage.delete().catch(() => {})
            }

            switch (counter) {
                case 0: 
                    if(!["enable",'disable'].includes(msg.content.toLowerCase())) {
                        collector.stop("1")
                        hoisterMessage.delete().catch(() => {})
                    }

                    if(msg.content.toLowerCase() === "disable") {
                        collector.stop("4")
                        hoisterMessage.delete().catch(() => {})
                        return;
                    }

                    let val = false
                    if(msg.content.toLowerCase() === "enable") {
                        val = true
                    } else {
                        val = false
                    }

                    finalData['value'] = val
                    msg.delete().catch(() => {})
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 1: 
                    let channel = msg.mentions.channels.first() ||
                    message.guild.channels.cache.find(c => c.id === msg.content || c.name.toLowerCase() === msg.content.toLowerCase())

                    if(!channel) {
                        collector.stop("1")
                        hoisterMessage.delete().catch(() => {})
                        return;
                    }
                    msg.delete().catch(() => {})
                    finalData['channel'] = channel.id
                    counter++
                    msg.delete().catch(() => {})
                    hoisterMessage.delete().catch(() => {})
                    collector.stop("2")
                break;
       

            }
        })


        collector.on('end', async (collected, reason) => {
            if(reason === "0") {
                return message.channel.send({content: `${client.custom_emojis.cross} • Process has been stopped!`})
            }
            if(reason === "1") {
               return message.channel.send({content: `${client.custom_emojis.cross} • There was an error with your anwser, please make sure to follow the steps!`})
            }
            if(reason === "4") {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    logging: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Logging have now been disabled!`})
                
            }
            if(reason === "2") {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    logging: true,
                    logging_channel: finalData.channel,
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Logging data has now been setup!`})
            }
        })
    }
}