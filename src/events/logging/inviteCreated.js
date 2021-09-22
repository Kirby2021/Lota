const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("inviteCreate", async (invite) => {
    const guild = await guilds.findOne({guildId: invite.guild.id})
    if(!guild.logging) return;
    if(!invite.guild) return;
    
    const embed = new MessageEmbed()
    .setTitle(`Invite Created!`)
    .setColor("YELLOW")
    .setDescription(` > ${client.custom_emojis.warning} • **Channel:** ${invite.channel ? `<#${invite.channel.id}>` : "No channel found"}
     > ${client.custom_emojis.warning} • **Author:** ${invite.inviter ? `<@${invite.inviter.id}>` : "No author"}`)
     .addFields(
         {name: "Information", value: ` > ${client.custom_emojis.tick} • **Code:** ${invite.code}\n > ${client.custom_emojis.tick} • **Max uses:** ${invite.maxUses ? invite.maxUses : "Not defined"}\n > ${client.custom_emojis.tick} • **Expires:** ${invite.expiresTimestamp ? `<t:${Math.floor(invite.expiresTimestamp / 1000)}:f>` : "Not defined"}`},
         {name: "URL", value: `${invite.url}`})
    .setTimestamp()

   
    const channel = invite.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(channel) {
        channel.send({embeds: [embed]})
    }
})