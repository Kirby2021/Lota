// url: https://luminabot.xyz/api/image/captcha?color=FFFFFF&text=6_charater_word


const guilds = require(`../schemas/guild`)
const { Message, MessageEmbed, Client, GuildMember, MessageCollector } = require('discord.js')

/**
 * 
 * @param {Message} message
 * @param {Client} client 
 * @param {GuildMember} member
 */ 
module.exports = async (member, client) => {
    function format(msg) {
        let text = msg;
    
       const terms = [
         { name: '{{user#mention}}', value: `<@${member.id}>` },
         { name: '{{user#tag}}', value: `${member.user.tag}` },
         { name: '{{user#id}}', value: `${member.id}` },
         { name: '{{server#id}}', value: `${member.guild.id}` },
         { name: '{{server#name}}', value: `${member.guild.name}` },
         { name: '{{server#membercount}}', value: `${member.guild.memberCount}` },
       ];
       
       for (let { name, value } of terms) text = text.replace(new RegExp(name, 'igm'), value);
       
       return text
       }

    
    const guild = await guilds.findOne({guildId: member.guild.id})
    if(guild.verification) {
    if(!guild.verification_channel) return;
    const channel = member.guild.channels.cache.find(c => c.id === guild.verification_channel)
    if(!channel) return;
    const word = getWord()
    const embed = new MessageEmbed()
    .setImage(`https://luminabot.xyz/api/image/captcha?color=FFFFFF&text=${word}`)
    .setColor(client.colors.pink)
        const hoisterMsg = await channel.send({content: `${format(guild.verification_message)}`, embeds: [embed]})

        const collector = new MessageCollector(channel, {time: 30000})
        collector.on("collect", (m) => {
            if(m.author.id !== member.id) return;
            if(m.content === word) {
                collector.stop("1")
                m.delete().catch(() => {})
                hoisterMsg.delete().catch(() => {})
            } else {
                collector.stop("0")
                m.delete().catch(() => {})
                hoisterMsg.delete().catch(() => {})
            }
        })

        collector.on("end", async (collected, reason) => {
            if(reason === "time") {
                hoisterMsg.delete().catch(() => {})
                channel.send({content: `${client.custom_emojis.cross} • **TIMED OUT** Please redo the captcha!`})
                .then((meeeeees) => {
                    setTimeout(() => {
                        meeeeees.delete().catch(() => {})
                    }, 4000);
                })  
                await reRun(member, client)
                return;
            }
            if(reason === "0") {
                channel.send({content: `${client.custom_emojis.cross} • Invalid charaters provided! Please retry`})
                .then((meeeeees) => {
                    setTimeout(() => {
                        meeeeees.delete().catch(() => {})
                    }, 4000);
                })  
                await reRun(member, client)
                hoisterMsg.delete().catch(() => {})
                return;
            }
            if(reason === "1") {
                member.roles.add(guild.verification_role).catch(() => {
                    return channel.send({content: `${client.custom_emojis.warning} • There was an error giving you this role! Please report it to a server admin!`})
                }) 
                return channel.send({content: `${client.custom_emojis.tick} • Thank you for verifying in ${channel.guild.name}!`})
            }

        })

    }
}

function getWord() {
    let chars = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqweryuiopasdfghjklzxcvbnm"
    let str = ""
    for(let i =0; i< 6; i++) {
        str += chars[Math.floor(Math.random() * chars.length)]
    }
    return str
}

async function reRun(member, client) {

    function format(msg) {
        let text = msg;
    
       const terms = [
         { name: '{{user#mention}}', value: `<@${member.id}>` },
         { name: '{{user#tag}}', value: `${member.user.tag}` },
         { name: '{{user#id}}', value: `${member.id}` },
         { name: '{{server#id}}', value: `${member.guild.id}` },
         { name: '{{server#name}}', value: `${member.guild.name}` },
         { name: '{{server#membercount}}', value: `${member.guild.memberCount}` },
       ];
       
       for (let { name, value } of terms) text = text.replace(new RegExp(name, 'igm'), value);
       
       return text
       }

    const guild = await guilds.findOne({guildId: member.guild.id})
    if(guild.verification) {
    if(!guild.verification_channel) return;
    const channel = member.guild.channels.cache.find(c => c.id === guild.verification_channel)
    if(!channel) return;
    const word = getWord()
    const embed = new MessageEmbed()
    .setImage(`https://luminabot.xyz/api/image/captcha?color=FFFFFF&text=${word}`)
    .setColor(client.colors.pink)
    const hoisterMsg = await channel.send({content: `${format(guild.verification_message)}`, embeds: [embed]})

        const collector = new MessageCollector(channel, {time: 60000})
        collector.on("collect", (m) => {
            if(m.author.id !== member.id) return;
            if(m.content === word) {
                collector.stop("1")
                m.delete().catch(() => {})
                hoisterMsg.delete().catch(() => {})
            } else {
                collector.stop("0")
                m.delete().catch(() => {})
                hoisterMsg.delete().catch(() => {})
            }
        })

        collector.on("end", (collected, reason) => {
            if(reason === "time") {
                return channel.send({content: `${client.custom_emojis.cross} • **TIMED OUT** Please redo the captcha!`})
            }
            if(reason === "0") {
                return channel.send({content: `${client.custom_emojis.cross} • Invalid charaters provided!`})
            }
            if(reason === "1") {
                member.roles.add(guild.verification_role).catch(() => {
                    return channel.send({content: `${client.custom_emojis.warning} • There was an error giving you this role! Please report it to a server admin!`})
                }) 
                return channel.send({content: `${client.custom_emojis.tick} • Thank you for verifying in ${channel.guild.name}!`})
            }

        })
    }
}
