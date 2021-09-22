const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

module.exports = {
    name: "setup-membercount",
    description: "Setup the counting system",
    category: "Settings",
    // owner: true,
    aliases: ["setup-membercounter"],
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
        .setTitle(`Membercount system! [1]`, client.user.displayAvatarURL())
        .setDescription(`Would you like to enable or disabled the feature? Types: \`disable\`,\`enable\``)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        const step2 = new MessageEmbed()
        .setTitle(`Membercount system! [2]`, client.user.displayAvatarURL())
        .setDescription(`What type of channel should the member counter channel be? (Types: \`text\`,\`voice\`)`)
        .setColor(client.colors.pink)
        .setFooter(`You can say "cancel" at any time to cancel the process`)

        let steps = [step1, step2]
        let counter = 0
        let hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const finalData = {
            value: undefined,
            channel: undefined,
            channel_type: undefined,
        }
        const collector = new MessageCollector(message.channel)

        collector.on("collect", async (msg) => {
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
                    if(!["text",'voice'].includes(msg.content.toLowerCase())) {
                        collector.stop("1")
                        hoisterMessage.delete().catch(() => {})
                    }
                    let type
                    if(msg.content.toLowerCase() === "text") {
                        type = "GUILD_TEXT"
                    }
                    if(msg.content.toLowerCase() === "voice") {
                        type = "GUILD_VOICE"
                    }
                    const channel = await message.guild.channels.create(`Member: ${message.guild.memberCount}`, {
                        type: type
                    })
                    if(channel.type === "GUILD_VOICE") {
                        message.guild.roles.cache.forEach((r) => {
                            channel.permissionOverwrites.create(r.id, {
                                CONNECT: false
                            })
                        })
                    }
                    msg.delete().catch(() => {})
                    finalData['channel'] = channel.id
                    finalData['channel_type'] = type
                    collector.stop("2")
                    hoisterMessage.delete().catch(() => {})
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
                    member_counter: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Counting have now been disabled!`})
                
            }
            if(reason === "2") {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    member_counter: true,
                    member_counter_channel: finalData.channel,
                    member_counter_channel_type: finalData.channel_type,
                    member_counter_channel_name: "Members: "
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Counting data has now been setup! *The channel updates every 10 minutes*`})
            }
        })
    }
}