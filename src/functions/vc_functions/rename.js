const { Client, Interaction, MessageCollector, ButtonInteraction, MessageEmbed } = require('discord.js')
const jtcRooms = require(`../../schemas/joinToCreateRooms`)

/**
 * 
 * @param {ButtonInteraction} interaction 
 * @param {Client} client 
 */
module.exports = async (interaction, client) => {
        let count = 0
        const embed = new MessageEmbed()
        .setDescription(` > ${client.custom_emojis.warning} • Please supply a name!`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" to cancel the process!`)

        const hoisterMessage = await interaction.reply({embeds: [embed], ephemeral: true})
        const collector = new MessageCollector(interaction.channel)
        let data = {
            name: undefined,
        }
        collector.on("collect", async (msg) => {
            if(msg.author.id !== interaction.user.id) return;
            if(msg.content.toLowerCase() === "cancel"){
                collector.stop("cancel")
                hoisterMessage.delete().catch(() => {})
                msg.delete().catch(() => {})
            }
            switch(count)  {
                case 0:
                    data['name'] = msg.content.split("").slice(0, 25).join("")
                    collector.stop("finshed")
                    msg.delete().catch(() => {})
                break;
            }
        })

        collector.on("end", async (collected, reason) => {
            if(reason === "err") {
                return;
            }
            if(reason === "cancel") {
                return interaction.channel.send({content: `${client.custom_emojis.tick} • Cancelled process`})
            }
            if(reason === "finshed"){
                interaction.member.voice.channel.setName(data.name)
                const renamed = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.tick} • I have renamed the vc to \`${data.name}\`!`)
                .setColor(client.colors.pink)

                return interaction.editReply({embeds: [renamed]})
            }
        })
}