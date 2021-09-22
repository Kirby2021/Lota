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
    channel.members.forEach((m) => {
        if(m.id === member.id) {
            return;
        } else {
        m.voice.disconnect().catch(() => {})
        }
    })

    const locked = new MessageEmbed()
    .setDescription(` > ${client.custom_emojis.warning} • Emptied your vc!`)
    .setColor(client.colors.pink)

    return interaction.reply({embeds: [locked], ephemeral: true})
}