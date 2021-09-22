const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("emojiDelete", async (emoji) => {
    const guild = await guilds.findOne({guildId: emoji.guild.id})
    if(!guild.logging) return;
    if(!emoji.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await emoji.guild.fetchAuditLogs({limit: 1, type: "EMOJI_DELETE"});
    const Entry = AuditLogFetch.entries.first();

    const embed = new MessageEmbed()
    .setTitle(`Emoji Deleted!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "Emoji", value: `> ${client.custom_emojis.tick} • **Name:** ${emoji.name}\n > ${client.custom_emojis.tick} • **ID:** \`${emoji.id}\``},
    )
    .setTimestamp()

   
    const logsChannel = emoji.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
})