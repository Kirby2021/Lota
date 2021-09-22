const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("stickerDelete", async (sticker) => {
    const guild = await guilds.findOne({guildId: sticker.guild.id})
    if(!guild.logging) return;
    if(!sticker.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await sticker.guild.fetchAuditLogs({limit: 1, type: "STICKER_DELETE"});
    const Entry = AuditLogFetch.entries.first();

    const embed = new MessageEmbed()
    .setTitle(`Sticker Deleted!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "Sticker", value: `> ${client.custom_emojis.tick} • **Name:** ${sticker.name}\n > ${client.custom_emojis.tick} • **ID:** \`${sticker.id}\``},
    )
    .setTimestamp()

    
    const logsChannel = sticker.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
})