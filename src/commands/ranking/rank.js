const { Client, Message, MessageEmbed, MessageAttachment } = require("discord.js")
const users = require(`../../schemas/users`)
const guilds = require("../../schemas/guild")
const canvacord = require("canvacord");

module.exports = {
    name: "rank",
    description: "See a members server rank!",
    category: "Ranking",
    // owner: true,
    // aliases: [],
    // usages: [],
    // botPermissions: [],
    // userPermissions: [],
    /**
     * @param {Client} client
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async(client, message, args) => {
        const member = message.mentions.members.first() ||
        message.guild.members.cache.find(m => m.id === args.join(" ").toLowerCase() || m.user.username.toLowerCase() === args.join(" ").toLowerCase()) || message.member
        const guild = await guilds.findOne({guildId: message.guild.id})
        const user = await users.findOne({guildId: message.guild.id, userId: member.id})
        if(guild.leveling) {
            const img = member.user.displayAvatarURL({format: "png"})

            const rank = new canvacord.Rank()
            .setAvatar(img)
            .setLevel(user.level)
            .setCurrentXP(user.xp)
            .setRank(0, "level", false)
            .setRequiredXP(user.requiredXp)
            .setStatus(member.presence.status)
            .setProgressBar("#FFFFFF", "COLOR")
            .setUsername(member.user.username)
            .setDiscriminator(member.user.discriminator);

         rank.build()
               .then(buffer => {
                   
                    const attachment = new MessageAttachment(buffer, "Rank.png")
                    message.reply({files: [attachment]})

                });

        } else {
            return message.reply({content: `${client.custom_emojis.cross} • Server levels are not enabled!`})
        }

    }
}