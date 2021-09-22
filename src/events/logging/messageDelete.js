const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
const { MessageEmbed } = require("discord.js")

client.on("messageDelete", async (message) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(!guild.logging) return;
    if(!message.guild) return;
    
    if(message.author) {
    const embed = new MessageEmbed()
    .setTitle(`Message Deleted!`)
    .setColor("YELLOW")
    .setDescription(` > ${client.custom_emojis.warning} • **Channel:** <#${message.channel.id}>\n > ${client.custom_emojis.warning} • **Author:** ${message ? `<@${message.author.id}>` : "No author found"}`)
    .addFields(
        {name: "Message", value: `${message.content}`}
    )
    .setTimestamp()

    
    const channel = message.guild.channels.cache.find(c => c.id === guild.logging_channel)
    if(channel) {
        channel.send({embeds: [embed]})
    }
}
})