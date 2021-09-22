const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("guildBanRemove", async (ban) => {
    const guild = await guilds.findOne({guildId: ban.guild.id})
    if(!guild.logging) return;
    if(!ban.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await ban.guild.fetchAuditLogs({limit: 1, type: "MEMBER_BAN_REMOVE"});
    const Entry = AuditLogFetch.entries.first();
    const embed = new MessageEmbed()
    .setTitle(`Unbanned User!`)
    .setColor("RED")
    .setDescription(` > ${client.custom_emojis.warning} • **Reason:** ${ban.reason ? ban.reason : "No reason"}\n > ${client.custom_emojis.warning} • **Member:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "User", value: `> ${client.custom_emojis.tick} • **Name:** ${ban.user.tag}\n > ${client.custom_emojis.tick} • **ID:** \`${ban.user.id}\``}
    )
    .setTimestamp()

   
    const channel = ban.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(channel) {
        channel.send({embeds: [embed]})
    }
})