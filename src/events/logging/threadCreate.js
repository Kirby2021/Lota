const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("threadCreate", async (thread) => {
    const guild = await guilds.findOne({guildId: thread.guild.id})
    if(!guild.logging) return;
    if(!thread.guild) return;
    if(!thread.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await thread.guild.fetchAuditLogs({limit: 1, type: "THREAD_CREATE"});
    const Entry = AuditLogFetch.entries.first();
    const embed = new MessageEmbed()
    .setTitle(`Thread Created!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "Thread", value: `> ${client.custom_emojis.tick} • **Name:** ${thread.name}\n > ${client.custom_emojis.tick} • **ID:** \`${thread.id}\`\n > ${client.custom_emojis.tick} • **Mention:** <#${thread.id}>`},
    )
    .setTimestamp()

    
    const logsChannel = thread.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
})