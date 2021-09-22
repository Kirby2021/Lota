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
        .setDescription(` > ${client.custom_emojis.warning} • Please supply a members name/id/mention that you would like to unban!`)
        .setColor(client.colors.pink)
        .setFooter(`Say "cancel" to cancel the process!`)

        const hoisterMessage = await interaction.reply({embeds: [embed], ephemeral: true})
        const collector = new MessageCollector(interaction.channel)
        let data = {
            member: undefined,
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
                    const member = msg.mentions.members.first() ||
                    msg.guild.members.cache.find(c => c.id === msg.content || c.user.username.toLowerCase() === msg.content.toLowerCase())
                    if(!member) {
                        collector.stop("err")
                        interaction.channel.send({content: `${client.custom_emojis.warning} • Please supply a valid member!`, ephemeral: true})
                        msg.delete().catch(() => {})
                    }
                    data['member'] = member.id
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
                const bannedMember = interaction.guild.members.cache.find(m => m.id === data.member)
                const roomOwner = interaction.guild.members.cache.find(m => m.id === interaction.user.id)
                const noMember = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.warning} • ${bannedMember} is not in your current vc!`)
                .setColor(client.colors.pink)

                const notBannedMember = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.warning} • ${bannedMember} is currently not a banned member!!`)
                .setColor(client.colors.pink)
               
                const unbanMember = new MessageEmbed()
                .setDescription(` > ${client.custom_emojis.tick} • ${bannedMember} has been unbanned from your vc!`)
                .setColor(client.colors.pink)
           
                        const room = await jtcRooms.findOne({userId: interaction.user.id, roomId: interaction.member.voice.channel.id})
                        if(room.bannedUsers.includes(bannedMember.id)) {
                            bannedMember.voice.disconnect().catch(() => {})
    
                            await jtcRooms.findOneAndUpdate({userId: interaction.user.id, roomId: interaction.member.voice.channel.id}, {
                                $pull: {
                                  bannedUsers: [bannedMember.id]
                            }
                            })
                            roomOwner.voice.channel.permissionOverwrites.create(bannedMember.id, {
                                CONNECT: true,
                            })
                            return interaction.editReply({embeds: [unbanMember], ephemeral: true})
                        } else {
                            return interaction.editReply({embeds: [notBannedMember], ephemeral: true})
                        }

                
                

                
            }

        })
}