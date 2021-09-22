const { Client, Message, MessageEmbed, MessageCollector } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreasons = {
    REQ: "0",
    ERR: "1",
    FINSHED: "2",
    DISABLE: "3"
}
module.exports = {
    name: "setup-applications",
    description: "Setup server applications",
    category: "Settings",
    // owner: true,
    aliases: ["setup-apps"],
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
        .setTitle(`Applications [1]`)
        .setDescription(`Would you like to enable or disable applications? \`enable\` / \`disable\``)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" to cancel the process at any time!`)

        const step2 = new MessageEmbed()
        .setTitle(`Applications [2]`)
        .setDescription(`Where should the final reports be sent? (Channel id/name/mention)`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" to cancel the process at any time!`)
        const steps = [step1, step2]
        let counter = 0

        const hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const collector = new MessageCollector(message.channel)
        const finalData = {
            value: undefined,
            channel: undefined,
        }
        collector.on("collect", (msg) => {
            if(msg.author.id !== message.author.id) return;
            if(msg.content.toLowerCase() === "cancel") {
                message.channel.send({content: `${client.custom_emojis.cross} • Process has been cancelled!`}).catch(() => {})
                collector.stop(stopreasons.REQ)
                hoisterMessage.delete().catch(() => {})
                msg.delete().catch(() => {})
                return;
            } 
            switch(counter) {
                case 0:
                    
                    if(!["enable","disable"].includes(msg.content.toLowerCase())) {
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid type! \`enable\`/\`disable\``}).catch(() => {})
                        collector.stop(stopreasons.ERR)
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                        return;
                    }
                    let val = false
                    if(msg.content.toLowerCase() === "enable") {
                        val = true
                    }
                    if(val === false) {
                        msg.delete().catch(() => {})
                        hoisterMessage.delete().catch(() => {})
                        collector.stop(stopreasons.DISABLE)
                    }
                    finalData['value'] = val
                    msg.delete().catch(() => {})
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                break;
                case 1:
                    const channel = msg.mentions.channels.first() ||
                    message.guild.channels.cache.find(c => c.id === msg.content || c.name === msg.content.toLowerCase())
                    if(!channel) {
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid channel!`}).catch(() => {})
                        collector.stop(stopreasons.ERR)
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                        return;
                    }
                    
                    finalData['channel'] = channel.id
                    msg.delete().catch(() => {})
                    hoisterMessage.delete().catch(() => {})
                    collector.stop(stopreasons.FINSHED)
                break;
            }
        })
        
        collector.on("end", async (collected, reason) => {
            if(reason === stopreasons.REQ) {
                return;
            }
            if(reason === stopreasons.ERR) {
                return;
            }
            if(reason === stopreasons.DISABLE) {
                await guilds.findOne({guildId: message.guild.id}, {
                    applications: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Applications have been disabled!`})
            }
            if(reason === stopreasons.FINSHED) {
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    applications: true,
                    applications_channel: finalData.channel
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Applications have been setup!`})
            }
        })
    }       
}