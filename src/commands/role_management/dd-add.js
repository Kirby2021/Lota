const { Client, Message, MessageEmbed, MessageCollector, MessageSelectMenu, MessageActionRow, Util } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreasons = {
    FINSHED: "0",
    ERR: "1",
    REQ: "2",
}
module.exports = {
    name: "dd-add",
    description: "Add / create a dropdown role",
    category: "role_management",
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
        let finalData = {
            message: undefined,
            embed_title: undefined,
            embed_color: undefined,
            embed_footer: undefined,
            channel: undefined,
            roles: [],
            messageId: undefined
        }
        const step1 = new MessageEmbed()
        .setTitle(`Dropdown roles [1]`)
        .setDescription(`What should the embed title be? Say "skip" to have no title!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)
        const step2 = new MessageEmbed()
        .setTitle(`Dropdown roles [2]`)
        .setDescription(`What should the embed description be? Say "roles" to make them set as the roles!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)
        const step3 = new MessageEmbed()
        .setTitle(`Dropdown roles [3]`)
        .setDescription(`What should the embed color be? Say "default" to have the default colour!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)
        const step4 = new MessageEmbed()
        .setTitle(`Dropdown roles [4]`)
        .setDescription(`What should the embed footer be? Say "skip" to have no footer!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)
        const step5 = new MessageEmbed()
        .setTitle(`Dropdown roles [5]`)
        .setDescription(`Where should the dropdown message / prompt be sent? (channel id/name/mention) Say "bind" to have it sent in the current channel!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)
        const step6 = new MessageEmbed()
        .setTitle(`Dropdown roles [6]`)
        .setDescription(`Please list your emojis and roles!  (E.G <emoji> <role id/mention/name> ) Say **done** once finshed!`)
        .setFooter(`Say "cancel" at any time to stop the process!`)
        .setColor(client.colors.pink)

        let counter = 0
        const steps = [step1, step2, step3, step4, step5, step6]
        const hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const collector = new MessageCollector(message.channel)
        collector.on("collect", (msg) => {
            if(msg.author.id !== message.author.id) return;
            if(msg.content.toLowerCase() === "cancel") {
                hoisterMessage.delete().catch(() => {})
                msg.delete().catch(() => {})
                message.channel.send({content: `${client.custom_emojis.tick} • Process has been stopped!`})
                collector.stop(stopreasons.REQ)
                return;
            }
            switch(counter) {
                case 0:  
                    if(msg.content.toLowerCase() === "skip") {
                        finalData['embed_title'] = "skipped"
                    } else {
                        finalData['embed_title'] = msg.content.split("").slice(0, 50).join("")
                    }
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                    msg.delete().catch(() => {})
                break;
                case 1:
                    if(msg.content.toLowerCase() === "roles") {
                        finalData['message'] = "roles"
                    } else {
                        finalData['message'] = msg.content.split("").slice(0, 1024).join("")
                    }
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                    msg.delete().catch(() => {})
                break;
                case 2:
                    
                    if(msg.content.toLowerCase() === "default") {
                        finalData['embed_color'] = client.colors.pink
                    } else {
                        if(testHex(msg.content)) {
                            finalData['embed_color'] = msg.content
                        } else {
                            message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid hex code (E.G #FFFFFF or FFFFFF)`})
                            collector.stop(stopreasons.ERR)
                            hoisterMessage.delete().catch(() => {})
                        }
                    }
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                    msg.delete().catch(() => {})
                break;
                case 3:
                    if(msg.content.toLowerCase() === "skip") {
                        finalData['embed_footer'] = "skipped"
                    } else {
                        finalData['embed_footer'] = msg.content.split("").slice(0, 50).join("")
                    }
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                    msg.delete().catch(() => {})
                break;
                case 4:
                    let channel;
                    if(msg.content.toLowerCase() === "bind") {
                        channel = message.channel
                    } else {
                        channel = msg.mentions.channels.first() || message.guild.channels.cache.find(c => c.id === msg.content || c.name.toLowerCase() === msg.content.toLowerCase())
                    }
                    if(!channel) {
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid channel or use "bind" to bind it to the current channel!`})
                            collector.stop(stopreasons.ERR)
                            hoisterMessage.delete().catch(() => {})
                    }
                    finalData['channel'] = channel.id
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]})
                    msg.delete().catch(() => {})
                break;
                case 5:
                    if(msg.content.toLowerCase() === "done"){
                        if(finalData.roles.length <= 0) {
                            message.channel.send({content: `${client.custom_emojis.cross} • Please supply some dropdown roles!`})
                            collector.stop(stopreasons.ERR)
                            hoisterMessage.delete().catch(() => {})
                            return;
                        }
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                        collector.stop(stopreasons.FINSHED) 
                        return;
                    }
                    const [emoji, ...roles] = msg.content.split(/ +/)
                    
                    const parsedEmoji = Util.parseEmoji(emoji)
                    if(!parsedEmoji.id) {
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid emoji!`})
                        hoisterMessage.delete().catch(() => {})
                        collector.stop(stopreasons.ERR)
                        
                    }
                    const serverrole = msg.mentions.roles.first() || message.guild.roles.cache.find(r => r.id === roles.join(" ") || r.name.toLowerCase() === roles.join(" ").toLowerCase())
                    if(!serverrole) {
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid role!`})
                        hoisterMessage.delete().catch(() => {})
                        collector.stop(stopreasons.ERR)
                        
                    }
                    let ex = parsedEmoji.animated ? `<a:${parsedEmoji.name}:${parsedEmoji.id}:>` : `<:${parsedEmoji.name}:${parsedEmoji.id}:>`
                    finalData.roles.push({emoji: `${ex}`, role: `${serverrole.id}`, viewEmoji: `${parsedEmoji.id}`})
                    
                break;
                
            }
        })

        collector.on("end", async (collected, reason) => {
            if(reason === stopreasons.REQ || reason === stopreasons.ERR) {
                return;
            }
            if(reason === stopreasons.FINSHED) {
 
                let roles = []
                let dropdownMenuItems = []
                dropdownMenuItems.push({
                    emoji: `<:icons_pause:884877256797855744>`,
                        label: `Place Holder`,
                        value: `place_holder`
                })
                finalData.roles.forEach((r) => {
                    const serverRoles = message.guild.roles.cache.find(x => x.id === r.role)
                    const serverEmoji = message.guild.emojis.cache.find(e => e.id === r.viewEmoji)
                    roles.push(` > ${serverEmoji} **•** <@&${r.role}>`)
                    dropdownMenuItems.push({
                        emoji: `${r.emoji}`,
                        label: `${serverRoles.name}`,
                        value: `${serverRoles.id}`,
                        description: `Click this to get the ${serverRoles.name} role!`
                    })
                })
                const row = new MessageActionRow()
                .addComponents([
                    new MessageSelectMenu()
                    .setPlaceholder("Choose your roles...")
                    .setCustomId("dropdown_roles")
                    .addOptions(dropdownMenuItems)
                ])
                const finalEmbed = new MessageEmbed()
                .setColor(finalData.embed_color)
                if(finalData.embed_title !== "skipped") { finalEmbed.setTitle(finalData.embed_title)}
                if(finalData.embed_footer !== "skipped") { finalEmbed.setFooter(finalData.embed_footer)}
                if(finalData.message === "roles") {
                    finalEmbed.setDescription(roles.join("\n"))
                } else {
                    finalEmbed.setDescription(finalData.message)
                }
                
                const channel = message.guild.channels.cache.find(c => c.id === finalData.channel)
                const finalMessage = await channel.send({embeds: [finalEmbed], components: [row]})
                const msgId = getId()
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    $push: {
                        dropdownRoles: [
                            {
                                msgId: finalMessage.id,
                                chanId: channel.id,
                                roles: finalData.roles,
                                id: `${msgId}`
                            }
                        ]
                    }
                })
                const embed = new MessageEmbed()
                .setColor(client.colors.pink)
                .setDescription(` > ${client.custom_emojis.tick} • **Created Dropdown roles!**\n\n > ${client.custom_emojis.warning} • Id: \`${msgId}\`\n > ${client.custom_emojis.warning} • [\`Jump\`](https://discordapp.com/channels/${message.guild.id}/${channel.id}/${finalMessage.id})`)
           
                message.channel.send({embeds: [embed]})
            }
        })
    }
}

function testHex(str) {
    let regexp = /#[0-9a-f]{6}|#[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{3}/gi
    if(regexp.test(str)) {
        if(str.split("").length > 6) {
            return false
        } else {
            return true
        }
    } else {
        return false
    }
}

function getId() {
    let chars = "123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm<>{}][)(*&^$_-+="
    let str = ""
    for(let i = 0; i < 15; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str;
}