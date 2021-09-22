const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("messageUpdate", async (oldMessage, newMessage) => {
    const guild = await guilds.findOne({guildId: newMessage.guild.id})
    if(!guild.logging) return;
    if(!newMessage.guild) return;
    if(newMessage) return;
    if(newMessage.author ? newMessage.author.bot : true) return;
    const embed = new MessageEmbed()
    .setTitle(`Message Edited!`)
    .setColor("YELLOW")
    .setDescription(` > ${client.custom_emojis.warning} • **Channel:** <#${newMessage.channel.id}>\n > ${client.custom_emojis.warning} • **Author:** <@${newMessage.author.id}>`)
    .addFields(
        {name: "Old Message", value: `${oldMessage.content}`},
        {name: "New Message", value: `${newMessage.content}`}
    )
    .setTimestamp()

    
    const channel = newMessage.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(channel) {
        channel.send({embeds: [embed]})
    }
})