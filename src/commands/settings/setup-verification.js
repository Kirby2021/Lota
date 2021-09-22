const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "setup-verification",
    description: "Setup server verification",
    category: "Settings",
    // owner: true,
    aliases: ["setup-verify"],
    // usages: [],
    botPermissions: ["MANAGE_ROLES"],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const step1 = new MessageEmbed()
        .setTitle(`Verfication [1]`, client.user.displayAvatarURL())
        .setDescription(`Would you like to enable or disabled the feature? Types: \`disable\`,\`enable\``)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step2 = new MessageEmbed()
        .setTitle(`Verification [2]`, client.user.displayAvatarURL())
        .setDescription(`What should the verification channel be?`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step3 = new MessageEmbed()
        .setTitle(`Verification [3]`, client.user.displayAvatarURL())
        .setDescription(`What is the verified role?`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step4 = new MessageEmbed()
        .setTitle(`Verification [4]`, client.user.displayAvatarURL())
        .setDescription(`What should the verfication message be?`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        let steps = [step1, step2, step3, step4]
        let counter = 0
        let hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const finalData = {
            value: undefined,
            channel: undefined,
            message: undefined,
            role: undefined
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
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 2: 
                    let role = msg.mentions.roles.first() ||
                     message.guild.roles.cache.find(c => c.id === msg.content || c.name.toLowerCase() === msg.content.toLowerCase())

                    if(!role) {
                       collector.stop("1")
                       hoisterMessage.delete().catch(() => {})
                        return;
                    }
                    msg.delete().catch(() => {})
                    finalData['role'] = role.id
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                break;
                case 3:
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
                    verification: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Verification have now been disabled!`})
                
            }
            if(reason === "2") {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    verification: true,
                    verification_channel: finalData.channel,
                    verification_message: finalData.message,
                    verification_role: finalData.role
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Verification data has now been setup!`})
            }
        })
    }
}