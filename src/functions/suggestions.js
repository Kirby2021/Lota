const { Message, Client, MessageEmbed, Channel, MessageActionRow, MessageButton } = require('discord.js')
const guilds = require(`../schemas/guild`)


/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Channel} channel
 */
module.exports.base = async (message, client) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(guild.suggestions) {
        if(guild.suggestions_channel === "NONE") return;
        const channel = message.guild.channels.cache.find(c => c.id === guild.suggestions_channel)
        if(channel) {
            if(message.channel.id === channel.id) {
                if(message.content.length >= 1024) return;
                const embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
                .setDescription(message.content)
                .addFields(
                    {name: ` > ${client.custom_emojis.warning} • Status`, value: `Awaiting response, please vote!`},
                        )
                .setColor("YELLOW")
    
                const msg = await message.channel.send({embeds: [embed]})
                await msg.react(client.custom_emojis.tick)
                await msg.react(client.custom_emojis.cross)
    
                setTimeout(() => {
                    message.delete().catch(() => {})
                }, 100);
            }
        }

    }
}


/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Channel} channel
 */
module.exports.accept = async (message, client, id, reason) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(!guild.suggestions) return;
    if(guild.suggestions_channel === "NONE") return;
    const channel = message.guild.channels.cache.find(c => c.id === guild.suggestions_channel)

    const msg = await channel.messages.fetch(id)
    if(!msg) {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }
    if(msg.author.id === client.user.id) {

    const msg_embed = msg.embeds[0]
    const embed = new MessageEmbed()
    .setAuthor(msg_embed.author.name, msg_embed.author.iconURL)
    .setDescription(msg_embed.description)
    .addFields(
        {name: ` > ${client.custom_emojis.tick} • Status`, value: `${reason}`},
    )
    .setColor("GREEN")

    setTimeout(() => {
        message.delete().catch(() => {})
    }, 100);
    msg.reactions.removeAll()
    await msg.edit({embeds: [embed]})
    let row = new MessageActionRow()
    .addComponents([ new MessageButton() .setStyle("LINK") .setURL(`https://discordapp.com/channels/${message.guild.id}/${channel.id}/${id}`) .setLabel("Jump To Message")])
    return message.channel.send({content: `${client.custom_emojis.tick} • Suggestion \`${id}\` has been accepted!`, components: [row]})

    } else {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }

}


/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Channel} channel
 */
 module.exports.deny = async (message, client, id, reason) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(!guild.suggestions) return;
    if(guild.suggestions_channel === "NONE") return;
    const channel = message.guild.channels.cache.find(c => c.id === guild.suggestions_channel)

    const msg = await channel.messages.fetch(id)
    if(!msg) {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }
    if(msg.author.id === client.user.id) {

    const msg_embed = msg.embeds[0]
    const embed = new MessageEmbed()
    .setAuthor(msg_embed.author.name, msg_embed.author.iconURL)
    .setDescription(msg_embed.description)
    .addFields(
        {name: ` > ${client.custom_emojis.cross} • Status`, value: `${reason}`},
    )
    .setColor("RED")

    setTimeout(() => {
        message.delete().catch(() => {})
    }, 100);
    msg.reactions.removeAll()
    await msg.edit({embeds: [embed]})
    let row = new MessageActionRow()
    .addComponents([ new MessageButton() .setStyle("LINK") .setURL(`https://discordapp.com/channels/${message.guild.id}/${channel.id}/${id}`) .setLabel("Jump To Message")])
    return message.channel.send({content: `${client.custom_emojis.tick} • Suggestion \`${id}\` has been denied!`, components: [row]})
    } else {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }


}

/**
 * 
 * @param {Message} message 
 * @param {Client} client 
 * @param {Channel} channel
 */
 module.exports.await = async (message, client, id) => {
    const guild = await guilds.findOne({guildId: message.guild.id})
    if(!guild.suggestions) return;
    if(guild.suggestions_channel === "NONE") return;
    const channel = message.guild.channels.cache.find(c => c.id === guild.suggestions_channel)

    const msg = await channel.messages.fetch(id)
    if(!msg) {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }
    if(msg.author.id === client.user.id) {

    const msg_embed = msg.embeds[0]
    const embed = new MessageEmbed()
    .setAuthor(msg_embed.author.name, msg_embed.author.iconURL)
    .setDescription(msg_embed.description)
    .addFields(
        {name: ` > ${client.custom_emojis.warning} • Status`, value: `Awaiting response, please vote!`},
    )
    .setColor("YELLOW")

    setTimeout(() => {
        message.delete().catch(() => {})
    }, 100);
    const newMsg = await msg.edit({embeds: [embed]})
    await newMsg.react(client.custom_emojis.tick)
    await newMsg.react(client.custom_emojis.cross)
    let row = new MessageActionRow()
    .addComponents([ new MessageButton() .setStyle("LINK") .setURL(`https://discordapp.com/channels/${message.guild.id}/${channel.id}/${id}`) .setLabel("Jump To Message")])
    return message.channel.send({content: `${client.custom_emojis.tick} • Suggestion \`${id}\` has been set to awaiting response!`, components: [row]})
    } else {
        return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid message id!`})
    }

}