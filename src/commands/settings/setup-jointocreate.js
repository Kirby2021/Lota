const { Client, Message, MessageEmbed, MessageCollector, MessageButton, MessageActionRow } = require("discord.js")
const guilds = require("../../schemas/guild")

const stopreasons = {
    REQ: "1",
    ERR: "0",
    FINSHED: "2",
    DISABLE: "3"
}

module.exports = {
    name: "setup-jointocreate",
    description: "Set the join to create / private vc system!",
    category: "Settings",
    // owner: true,
    aliases: ["setup-jtc"],
    // usages: [],
    // botPermissions: [],
    userPermissions: ["ADMINISTRATOR"],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const finalData = {
            value: undefined,
            jtc_channel: undefined,
            jtc_controls: undefined,
        }
        const step1 = new MessageEmbed()
        .setTitle(`Join To Create [1]`)
        .setDescription(`Would you like to enable or disable join to create? \`enable\`/\`disable\``)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" at any time to stop the process`)

        const step2 = new MessageEmbed()
        .setTitle(`Join To Create [2]`)
        .setDescription(`What channel should the users have to join to create the room? (Say "create me one" to get one auto created!)`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" at any time to stop the process`)

        const step3 = new MessageEmbed()
        .setTitle(`Join To Create [3]`)
        .setDescription(`What channel should the room controls be sent in? (Say "create me one" to get one auto created!)`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" at any time to stop the process`)

        const steps = [step1, step2, step3]
        let counter = 0
        const hoisterMessage = await message.channel.send({embeds: [steps[counter]]})
        const collector = new MessageCollector(message.channel)
        collector.on("collect", async (msg) => {
            if(msg.author.id !==  message.author.id) return;
            if(msg.content.toLowerCase() === "cancel") {
                collector.stop(stopreasons.REQ)
                message.channel.send({content: `${client.custom_emojis.tick} • Process has been stopped`})
                hoisterMessage.delete().catch(() => {})
                msg.delete().catch(() => {})
            }
            switch (counter) {
                case 0: 
                    if(!["enable","disable"].includes(msg.content.toLowerCase())) {
                        collector.stop(stopreasons.ERR)
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid type! \`enable\` / \`disable\` `})
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                    }
                    if(msg.content.toLowerCase() === "disable") {
                        collector.stop(stopreasons.DISABLE)
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                    }
                    let val = false
                    if(msg.content.toLowerCase() === "enable") {
                        val = true
                    }
                    finalData['value'] = val
                    counter++
                    hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                    msg.delete().catch(() => {})
                break;
                case 1:
                    let channel = msg.mentions.channels.first() ||
                    msg.guild.channels.cache.find(c => c.id === msg.content || c.name.toLowerCase() === msg.content.toLowerCase())
                    if(msg.content.toLowerCase() === "create me one") {
                        channel = await message.guild.channels.create(`Join to create!`, {type: "GUILD_VOICE"})
                        channel.setParent(message.channel.parentId)
                        finalData['jtc_channel'] = channel.id
                        counter++
                        hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                        msg.delete().catch(() => {})
                        return;
                    }
                    if(!channel || channel.type !== "GUILD_VOICE") {
                        collector.stop(stopreasons.ERR)
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid text channel id/name/mention`})
                        hoisterMessage.delete().catch(() => {})
                        msg.delete().catch(() => {})
                    } else {
                        finalData['jtc_channel'] = channel.id
                        counter++
                        hoisterMessage.edit({embeds: [steps[counter]]}).catch(() => {})
                        msg.delete().catch(() => {})
                    }
                break;
                case 2:
                    let channel2 = msg.mentions.channels.first() ||
                    msg.guild.channels.cache.find(c => c.id === msg.content || c.name.toLowerCase() === msg.content.toLowerCase())
                    msg.delete().catch(() => {})
                    if(msg.content.toLowerCase() === "create me one") {
                        channel2 = await message.guild.channels.create(`Room Controls!`)
                        channel2.setParent(message.channel.parentId)
                        finalData['jtc_controls'] = channel2.id
                        hoisterMessage.delete().catch(() => {})
                        collector.stop(stopreasons.FINSHED)
                        return;
                    }
                    if(!channel2 || channel2.type !== "GUILD_TEXT") {
                        collector.stop(stopreasons.ERR)
                        message.channel.send({content: `${client.custom_emojis.cross} • Please supply a valid text channel id/name/mention`})
                        hoisterMessage.delete().catch(() => {})
                        
                    } else {
                        finalData['jtc_controls'] = channel2.id
                        hoisterMessage.delete().catch(() => {})
                        collector.stop(stopreasons.FINSHED)
                    }
                    
                break;
            }
        })

        collector.on("end", async (collected, reason) => {
            if(reason === stopreasons.ERR || reason === stopreasons.REQ) {
                return;
            }
            if(reason === stopreasons.DISABLE) {
                const guild = await guilds.findOne({guildId: message.guild.id})
                if(guild.jtc) {
                    
                    const controlChan = message.guild.channels.cache.find(c => c.id === guild.jtc_controls_channel)
                    if(controlChan) {
                        const msg = await controlChan.messages.fetch(guild.jtc_controls_message)
                        if(msg) {
                            msg.delete().catch(() => {})
                        }
                    }
                }
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    jtc: false
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Join to create has now been disabled!`})
            }
            if(reason === stopreasons.FINSHED) {
               
                
                const controlsChannel = message.guild.channels.cache.find(c => c.id === finalData.jtc_controls)
                const controlsEmbed = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.tick} **• Join to create controls!**\n\n > ${client.custom_emojis.warning} **• Ban!** - Perm remove a member from the vc\n > ${client.custom_emojis.warning} **• Unban!** - Unban a member from the vc!\n > ${client.custom_emojis.warning} **• Kick!** - Kick a member from the vc!\n > ${client.custom_emojis.warning} **• Lock!** - Lock the vc!\n > ${client.custom_emojis.warning} **• Unlock!** - Unlock the vc!\n > ${client.custom_emojis.warning} **• Empty!** - Remove everyone from the vc!\n > ${client.custom_emojis.warning} **• Mute!** - Server mute a member in the vc!\n> ${client.custom_emojis.warning} **• Unmute!** - Unmute a member in the vc!\n> ${client.custom_emojis.warning} **• Rename!** - Rename your vc!`)
                .setColor(client.colors.pink)
                const row = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                    .setLabel("Ban")
                    .setCustomId("jtc_ban")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Unban")
                    .setCustomId("jtc_unban")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Kick")
                    .setCustomId("jtc_kick")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Lock")
                    .setCustomId("jtc_lock")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Unlock")
                    .setCustomId("jtc_unlock")
                    .setStyle("DANGER"),
                ])
                const row2 = new MessageActionRow()
                .addComponents([
                    new MessageButton()
                    .setLabel("Empty")
                    .setCustomId("jtc_empty")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Mute User")
                    .setCustomId("jtc_mute")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Unmute User")
                    .setCustomId("jtc_unmute")
                    .setStyle("DANGER"),
                    new MessageButton()
                    .setLabel("Rename")
                    .setCustomId("jtc_rename")
                    .setStyle("DANGER"),
                ])
            

                const controlsMSg = await controlsChannel.send({embeds: [controlsEmbed], components: [row, row2]})
                await guilds.findOneAndUpdate({guildId: message.guild.id}, {
                    jtc: true,
                    jtc_channel: finalData.jtc_channel,
                    jtc_controls_channel: finalData.jtc_controls,
                    jtc_controls_message: controlsMSg.id
                })
                return message.channel.send({content: `${client.custom_emojis.tick} • Join to create has now been setup!`})
            }
        })

    }
}