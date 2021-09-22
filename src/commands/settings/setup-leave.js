const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "setup-leave",
    description: "Setup server leave messages",
    category: "Settings",
    // owner: true,
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const step1 = new MessageEmbed()
        .setTitle(`Leave Message / Embed [1]`, client.user.displayAvatarURL())
        .setDescription(`Would you like to enable or disabled the feature? Types: \`disable\`,\`enable\``)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step2 = new MessageEmbed()
        .setTitle(`Leave Message / Embed [2]`, client.user.displayAvatarURL())
        .setDescription(`What should the leave message channel be?`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step3 = new MessageEmbed()
        .setTitle(`Leave Message / Embed [3]`, client.user.displayAvatarURL())
        .setDescription(`Should the bot dm the user the message? (True of false answer!)`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step4 = new MessageEmbed()
        .setTitle(`Leave Message / Embed [4]`, client.user.displayAvatarURL())
        .setDescription(`Should the message be in an embed? (True of false answer!)`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step5 = new MessageEmbed()
        .setTitle(`Leave Message / Embed [5]`, client.user.displayAvatarURL())
        .setDescription(`What should the leave message be?`)
        .addFields({name: "Tags", value: `\`\`\`{{user#mention}} - mentions the user\n{{user#tag}} - the users tag\n{{user#id}} - the users id\n{{server#membercount}} - the servers membercount\n{{server#name}} - the servers name\n{{server#id}} - the servers id\n\`\`\``})
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        let steps = [step1, step2, step3, step4, step5]
        let counter = 0
        let hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const finalData = {
            value: undefined,
            channel: undefined,
            dm: undefined,
            embed: undefined,
            message: undefined
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
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 2:
                    if(!["true",'false'].includes(msg.content.toLowerCase())) {
                        collector.stop("1")
                        hoisterMessage.delete().catch(() => {})
                    }

                    let val2 = false
                    if(msg.content.toLowerCase() === "true") {
                        val2 = true
                    } else {
                        val2 = false
                    }
                    msg.delete().catch(() => {})
                    finalData['dm'] = val2
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 3: 
                    if(!["true",'false'].includes(msg.content.toLowerCase())) {
                        collector.stop("1")
                        hoisterMessage.delete().catch(() => {})
                    }

                    let val3 = false
                    if(msg.content.toLowerCase() === "true") {
                        val3 = true
                    } else {
                        val3 = false
                    }
                    msg.delete().catch(() => {})
                    finalData['embed'] = val3
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 4: 
                    finalData['message'] = msg.content
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
                    leave: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Leaves have now been disabled!`})
                
            }
            if(reason === "2") {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    leave: true,
                    leave_dmuser: finalData.dm,
                    leave_channel: finalData.channel,
                    leave_message: finalData.message,
                    leave_embed: finalData.embed
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Leave data has now been setup!`})
            }
        })
    }
}