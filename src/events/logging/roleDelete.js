const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("roleDelete", async (role) => {
    const guild = await guilds.findOne({guildId: role.guild.id})
    if(!guild.logging) return;
    if(!role.guild) return;
    if(!role.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;
    

    const AuditLogFetch = await role.guild.fetchAuditLogs({limit: 1, type: "ROLE_DELETE"});
    const Entry = AuditLogFetch.entries.first();
    const embed = new MessageEmbed()
    .setTitle(`Role Deleted!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** ${Entry ? `<@${Entry.executor.id}>` : "No author"}`)
    .addFields(
        {name: "Role", value: `> ${client.custom_emojis.tick} • **Name:** ${role.name}\n > ${client.custom_emojis.tick} • **ID:** \`${role.id}\``},
    )
    .setTimestamp()

    
    const logsChannel = role.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
})