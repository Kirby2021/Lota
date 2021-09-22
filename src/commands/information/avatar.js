const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "avatar",
    description: "See a members avatar",
    category: "Information",
    aliases: ["av"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        
        let member = message.mentions.channels.first() || message.guild.members.cache.find(m => m.id === args.join(" ") || m.user.username.toLowerCase() === args.join(" ").toLowerCase() || m.user.tag.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        
        const embed = new MessageEmbed()
        .setDescription(`**[16px](${member.user.displayAvatarURL({dynamic: true, size: 16})})** • **[32px](${member.user.displayAvatarURL({dynamic: true, size: 32})})** • **[64px](${member.user.displayAvatarURL({dynamic: true, size: 64})})** • **[128px](${member.user.displayAvatarURL({dynamic: true, size: 128})})** • **[256px](${member.user.displayAvatarURL({dynamic: true, size: 256})})** • **[512px](${member.user.displayAvatarURL({dynamic: true, size: 512})})** • **[1024px](${member.user.displayAvatarURL({dynamic: true, size: 1024})})** • **[2048px](${member.user.displayAvatarURL({dynamic: true, size: 2048})})** • **[4096px](${member.user.displayAvatarURL({dynamic: true, size: 4096})})**`)
        .setColor(client.colors.pink)
        .setImage(member.user.displayAvatarURL({dynamic: true, size: 1024}))
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        return message.reply({embeds: [embed]})
    }
}