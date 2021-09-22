const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "fetchinvite",
    description: "Fetch an invite for a server!",
    category: "Owner",
    owner: true,
    aliases: ["finvite","finv"],
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

        message.author.send({content: `**Guild:** ${guild.name}\n**Invite:** ||${invite}||`})
        message.delete()
    }
}