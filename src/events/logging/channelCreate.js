const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("channelCreate", async (channel) => {
    const guild = await guilds.findOne({guildId: channel.guild.id})
    if(!guild.logging) return;
    if(!channel.guild) return;
    if(!channel.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_CREATE"});
    const Entry = AuditLogFetch.entries.first();
    const embed = new MessageEmbed()
    .setTitle(`Channel Created!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "Channel", value: ` > ${client.custom_emojis.tick} • **Name:** ${channel.name}\n > ${client.custom_emojis.tick} • **ID:** \`${channel.id}\`\n > ${client.custom_emojis.tick} • **Mention:** <#${channel.id}>`},
    )
    .setTimestamp()

    const logsChannel = channel.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
})