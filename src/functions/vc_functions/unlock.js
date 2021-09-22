const { Client, Interaction, MessageCollector, MessageEmbed } = require('discord.js')
const jtcRooms = require(`../../schemas/joinToCreateRooms`)

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
module.exports = async (interaction, client) => {
    
    const member = interaction.guild.members.cache.find(m => m.id === interaction.user.id)
    const channel = member.voice.channel

    const room = await jtcRooms.findOne({userId: member.id, roomId: member.voice.channel.id})
    if(!room.locked) {
    const alrlocked = new MessageEmbed()
    .setDescription(` > ${client.custom_emojis.warning} • This vc is not locked!`)
    .setColor(client.colors.pink)

    return interaction.reply({embeds: [alrlocked], ephemeral: true})
    }
    member.voice.channel.permissionOverwrites.create(interaction.guild.id, {
        CONNECT: true,
    })

    await jtcRooms.findOneAndUpdate({userId: member.id, roomId: channel.id}, {
        locked: false,
    })
    
    const locked = new MessageEmbed()
    .setDescription(` > ${client.custom_emojis.warning} • Your vc has been unlocked!`)
    .setColor(client.colors.pink)

    return interaction.reply({embeds: [locked], ephemeral: true})
}