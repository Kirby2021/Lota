const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreasons = {
    REQ: "1",
    ERR: "2",
    FINSHED: "3"
}

module.exports = {
    name: "application-create",
    description: "Create a server application",
    category: "Administrator",
    // owner: true,
    aliases: ["app-create"],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const guild = await guilds.findOne({guildId: message.guild.id})
        if(guild.applications === false){
            message.channel.send({content: `${client.custom_emojis.cross} • Please enable applications before using this command!`})
        } else {

            if(guild.applications_list.length >= 10) {
                message.channel.send({content: `${client.custom_emojis.cross} • Non-premium guilds can only have 10 applications!`})
            }
        const step1 = new MessageEmbed()
        .setDescription(` > **Applications Creation [1]**\n > What should be the command to run the application prompt?`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" at any time to cancel the process!`)
        const step2 = new MessageEmbed()
        .setDescription(` > **Applications Creation [2]**\n > What should the questions be? Type each one out as a new message, say "done" when your finished (**Max 25 questions**)`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" at any time to cancel the process!`)
        const steps = [step1, step2]
        let counter = 0
        const hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const collector = new MessageCollector(message.channel)
        const finalData = {
            command: undefined,
            questions: [],
        }
        collector.on("collect", (msg) => {
            if(msg.author.id !== message.author.id) return;
            if(msg.content.toLowerCase() === "cancel") {
                collector.stop(stopreasons.REQ)
                hoisterMessage.delete().catch(() => {})
                msg.delete().catch(() => {})
            }

            switch(counter) {
                case 0:
                    finalData['command'] = msg.content.toLowerCase()
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                    msg.delete().catch(() => {})
                break;
                case 1:
                    
                    if(msg.content.toLowerCase() === "done") {
                        if(finalData.questions.length <= 0) {
                            collector.stop(stopreasons.ERR)
                            hoisterMessage.delete().catch(() => {})
                            msg.delete().catch(() => {}) 
                            return message.channel.send({content: `${client.custom_emojis.cross} • Please supply some questions!`})
                        } else {
                            finalData['questions'] = finalData.questions.slice(0,25);
                            collector.stop(stopreasons.FINSHED)
                            hoisterMessage.delete().catch(() => {})
                            msg.delete().catch(() => {}) 
                            return;
                        }
                    } else {
                        finalData.questions.push(msg.content)
                        msg.delete().catch(() => {}) 
                    }
                break;
            }
        })
        collector.on("end", async (collected, reason) => {
            if(reason === stopreasons.REQ || reason === stopreasons.ERR) {
                return;
            }
            if(reason === stopreasons.FINSHED) {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    $push: {
                        applications_list: [{
                            cmd: finalData.command,
                            questions: finalData.questions
                        }]
                    }
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Saved application **${finalData.command}**!`})
                
            }
        })

    }

    }
}