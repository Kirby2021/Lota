const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreaons = {
    ERR: "1",
    REQ: "2",
    FINSHED: "3"
}
module.exports = {
    name: "application",
    description: "Run an application",
    category: "Utils",
    // owner: true,
    aliases: ["apps","app"],
    // usages: [],
    botPermissions: ["MANAGE_CHANNELS"],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        const finalData = {
            responses: [],
            user: message.author.id,
            time: Date.now()
        }
        if(guild.applications) {
            if(guild.applications_list.length <= 0) {
                return message.reply({content: `${client.custom_emojis.cross} • There are no applications setup!`})
            }
            if(!args.length) {
                let apps = []
                guild.applications_list.map((app) => {
                    apps.push(` > ${client.custom_emojis.tick} • \`${app.cmd}\``)
                })
                const embed = new MessageEmbed()
                .setTitle(`Server Applications`)
                .setDescription(apps.join("\n"))
                .setColor(client.colors.pink)

                return message.reply({embeds: [embed]})
            }
            let already_application_open = false
            message.guild.channels.cache.forEach((c) => {
                if(c.name.endsWith(message.author.id)) {
                    already_application_open = true
                }
            })
            if(already_application_open) {
                return message.reply({content: `${client.custom_emojis.cross} • You already have an application open <#${message.guild.channels.cache.find(c => c.name.endsWith(message.author.id)).id}>! ( If you believe this is a mistake please just get the channel deleted and retry the command! ) `})
            }
            let chosen_app;
            let valid_app = false
            guild.applications_list.map((app) => {
                if(app.cmd.toLowerCase() === args.join(" ").toLowerCase()) {
                    valid_app = true
                    chosen_app = app;
                }
            })
            if(valid_app) {
                let steps = []
                guild.applications_list.map((app) => {
                    if(app.cmd.toLowerCase() === args.join(" ").toLowerCase()) {
                        app.questions.forEach((q) => {
                            const embed = new MessageEmbed()
                            .setDescription(q)
                            .setColor(client.colors.pink)
                            steps.push(embed)
                        })
                    }
                })
                let current_pos = 0
                
                const channel = await message.guild.channels.create(`Application-${message.author.id}`)
                message.channel.send({content: `You application prompt is running! <#${channel.id}>`})
                channel.send({content: `<@${message.author.id}>`})
                .then((m) => {setTimeout(() => {
                    m.delete().catch(() => {})
                }, 100);})
                channel.permissionOverwrites.create(message.author.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    USE_EXTERNAL_EMOJIS: true,
                    USE_EXTERNAL_STICKERS: true,
                })
                channel.permissionOverwrites.create(client.user.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    USE_EXTERNAL_EMOJIS: true,
                    USE_EXTERNAL_STICKERS: true,
                    MANAGE_MESSAGES: true,
                    EMBED_LINKS: true
                })
                channel.permissionOverwrites.create(message.guild.id, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                    USE_EXTERNAL_EMOJIS: false,
                    USE_EXTERNAL_STICKERS: false,
                })
                const hoisterMessage = await channel.send({embeds: [steps[current_pos]]}).catch(() => {})
                const collector = new MessageCollector(channel)
                collector.on("collect", async (msg) => {
                    if(msg.content.toLowerCase() === "cancel") {
                        collector.stop(stopreaons.REQ)
                        hoisterMessage.delete().catch(() => {})
                        return channel.send({content: `${client.custom_emojis.tick} • Application has been cancelled!`})
                    }
                    
                    switch(current_pos) {
                        case current_pos:
                            msg.delete().catch(() => {})
                            current_pos++
                            finalData.responses.push(msg.content)
                            if(current_pos === steps.length) {
                                

                                hoisterMessage.delete().catch(() => {})
                                collector.stop(stopreaons.FINSHED)
                                
                            } else {
                                hoisterMessage.edit({embeds: [steps[current_pos]]}).catch(() => {})
                            }
                            
                        break;
                        
                    }
                  
                })
            
                collector.on('end', async (collected, reason) => {
                    setTimeout(() => {
                        channel.delete().catch(() => {})
                    }, 3000);
                    if(reason === stopreaons.REQ || reason === stopreaons.ERR) {
                        return;
                    }
                    if(reason === stopreaons.FINSHED) {
                        
                        const fieldsValues = []
                        let questions = []
                        guild.applications_list.map((c) => {
                            if(c.cmd.toLowerCase() === args.join(" ").toLowerCase()) {
                            c.questions.forEach((q_) => {
                                questions.push(` > ${q_}`)
                            })
                        }
                        })
                        let pos = 0
                        finalData.responses.forEach((res) => {
                            fieldsValues.push(` > **#${pos++})** ${res}`)
                        })
                        const reportChannel = message.guild.channels.cache.find(c => c.id === guild.applications_channel)
                        const embed = new MessageEmbed()
                        .setTitle(`Application Summited`)
                        .setDescription(` > ${client.custom_emojis.warning} • Application: \`${args.join(" ")}\``)
                        .addFields({name: "Responses", value: `${fieldsValues.join("\n")}`}, {name: "Questions", value: `${questions.join("\n")}`})
                        .setColor(client.colors.pink)

                        reportChannel.send({embeds: [embed]})
                        
                    }
                })
            } else {
                return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid application!`})
            }

        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Please enable applications before running this command!`})
        }
    }
}