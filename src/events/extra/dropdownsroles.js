const { Interaction, MessageEmbed } = require("discord.js")
const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
/**
 * @param {Interaction} interaction
 */
client.on("interactionCreate", async (interaction) => {
    if(interaction.isSelectMenu()) {
        const guild = await guilds.findOne({guildId: interaction.guild.id})
        if(guild.dropdownRoles.length > 0) {
            if(interaction.customId === "dropdown_roles") {
                if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({content: `${client.custom_emojis.cross} • I am missing the required permissions to give you these roles!`})
                guild.dropdownRoles.forEach((dd) => {
                    if(dd.msgId === interaction.message.id) {
                        if(interaction.values[0] === "place_holder") {
                            interaction.deferUpdate()
                            
                        } else {
                        dd.roles.forEach((r) => {
                            if(r.role === interaction.values[0]) {
                                const member = interaction.member
                                let hasrole = false
                                interaction.member.roles.cache.forEach((x) => {
                                    if(x.id === r.role) { 
                                        hasrole = true;
                                        return;
                                    }
                                })
                               
                                if(hasrole) {
                                    interaction.member.roles.remove(r.role)
                                   const embed = new MessageEmbed()
                                   .setDescription(`> ${client.custom_emojis.tick} • I have removed the <@&${r.role}> role from you!`)
                                   .setColor(client.colors.pink)
                                   interaction.reply({embeds: [embed], ephemeral: true})
                                } else {
                                    interaction.member.roles.add(r.role)
                                    const embed = new MessageEmbed()
                                   .setDescription(`> ${client.custom_emojis.tick} • I have gave you the <@&${r.role}> role!`)
                                   .setColor(client.colors.pink)
                                   interaction.reply({embeds: [embed], ephemeral: true})
                                }
                            }
                        })
                    }
                    }
                })
            }
        }
    }
})