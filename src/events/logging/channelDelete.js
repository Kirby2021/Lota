const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("channelDelete", async (channel) => {
    if(!channel.guild) return;
    const guild = await guilds.findOne({guildId: channel.guild.id})
    if(guild.welcome) {
        if(guild.welcome_channel === channel.id) {
            await guilds.findOneAndUpdate({guildId: channel.guild.id}, {
                welcome: false,
                welcome_channel: "NONE",
                welcome_dmuser: false,
                welcome_message: "Welcome {{user#mention}}",
                welcome_embed: false,
            })
        }
    }
    if(guild.leave) {
        if(guild.leave_channel === channel.id) {
            await guilds.findOneAndUpdate({guildId: channel.guild.id}, {
                leave: false,
                leave_channel: "NONE",
                leave_dmuser: false,
                leave_message: "Goodbye {{user#mention}}",
                leave_embed: false,
            })
        }
    }
    if(guild.logging) {
        if(guild.logging_channel === channel.id) {
        await guilds.findOneAndUpdate({guildId: channel.guild.id}, {
            logging: false,
            logging_channel: "NONE"
        })
        }


    if(!channel.guild.me.permissions.has("VIEW_AUDIT_LOG")) return;

    const AuditLogFetch = await channel.guild.fetchAuditLogs({limit: 1, type: "CHANNEL_DELETE"});
    const Entry = AuditLogFetch.entries.first();
    const embed = new MessageEmbed()
    .setTitle(`Channel Deleted!`)
    .setColor("YELLOW")
    .setDescription(`> ${client.custom_emojis.warning} • **Author:** <@${Entry.executor.id}>`)
    .addFields(
        {name: "Channel", value: `> ${client.custom_emojis.tick} • **Name:** ${channel.name}\n > ${client.custom_emojis.tick} • **ID:** \`${channel.id}\``},
    )
    .setTimestamp()

    
    const logsChannel = channel.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(logsChannel) {
        logsChannel.send({embeds: [embed]})
    }
    }

})