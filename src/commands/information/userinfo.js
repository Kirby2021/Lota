const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "userinfo",
    description: "See information on a member",
    category: "Information",
    aliases: ["ui","whois","who"],
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

        let totalRoles = []
        member.roles.cache.forEach((r) => {
            totalRoles.push(r)
        })
        let perms = []
        member.permissions.toArray().forEach((p) => {
            const everyoneRole = message.guild.roles.cache.find(r => r.id === message.guild.id)
            if(everyoneRole.permissions.toArray().includes(p)) {
                return;
            } else {
                perms.push(client.utils.formatUnderlines(p))
            }
        })
            
        
        const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL({dynamic: true}))
        .addFields(
            {name: "Mention & ID", value: `<@${member.id}> (\`${member.id}\`)`},
            {name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:D>`, inline: true},
            {name: `Joined Discord`, value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:D>`, inline: true},
            {name: `Roles [${member.roles.cache.size}]`, value: `${totalRoles.join(", ")}`},
            {name: `Permissions`, value: `${perms.join(", ")}`}
        )
        .setColor(client.colors.pink)
        .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

        message.reply({embeds: [embed]})
    }
}