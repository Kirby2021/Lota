const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "leaveguild",
    description: "Leave a guild",
    category: "Owner",
    owner: true,
    aliases: ["lguild","leaveserver","lserver"],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        let guild = client.guilds.cache.find(g => g.id === args.join(" ") || g.name.toLowerCase() === args.join(" ").toLowerCase()) ||
        message.guild

        let invite
        let textChannels = guild.channels.cache.find(c => c.type === "GUILD_TEXT" && c.permissionsFor(guild.me).has("CREATE_INSTANT_INVITE"))
        if(!textChannels) { invite = "No channels" }
        await textChannels.createInvite({
            maxAge: 0,
            maxUses: 0
        }).then((inv) => {
            invite = inv.url
        })
        const embed = new MessageEmbed()
        .addFields(
            {name: "Guild ID", value: `\`${guild.id}\``, inline: true},
            {name: "Member Count", value: `${guild.memberCount} members`, inline: true},
            {name: "Invite", value: `${invite}`}
        )
        .setColor(client.colors.red)
        .setFooter(`${client.guilds.cache.size} Guilds`, client.user.displayAvatarURL())

        client.channels.cache.find(c => c.id === "886589735567499334").send({embeds: [embed]})
        guild.leave()
    }
}