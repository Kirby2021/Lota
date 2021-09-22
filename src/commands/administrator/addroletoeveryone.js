const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "addroletoeveryone",
    description: "Give a role to everyone in the server!",
    category: "Administrator",
    // aliases: [],
    // usages: [],
    botPermissions: ["MANAGE_ROLES"],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id === args.join(" ").toLowerCase() || r.name.toLowerCase() === args.join(" ").toLowerCase())
        if(!role || !args) {
            return message.reply({content: `${client.custom_emojis.cross} • Please supply a valid role!`})
        }
        if(role.position >= message.guild.me.roles.highest.position) {
            return message.reply({content: `${client.custom_emojis.cross} • Missing permissions! Please move my role higher than the mentioned role!`})
        }
        
        let finshed = 0
        let msg = await message.reply({content: `${client.custom_emojis.warning} • Adding roles to everyone, this may take a while! You will be pinged once finshed`})
        message.guild.members.cache.forEach((m) => {
            setTimeout(() => {
                if(m.roles.cache.find(r => r.id === role.id)) {
                    return;
                } else {
                finshed++
                m.roles.add(role).catch((err) => {
                    finshed--
                })
                }
            }, 10000);
        })


      setTimeout(() => {
        msg.edit({content: `${client.custom_emojis.tick} • Finshed adding role ${role.name} to ${finshed} members!`})
        message.channel.send({content: `<@${message.author.id}>`})
        .then((mes) => {
            setTimeout(() => {
                mes.delete()
            }, 100);
            
        })
      }, 10000 * Number(message.guild.memberCount));
            
        

       
        
    }
}