const { Client, Message, MessageEmbed } = require("discord.js")
const users = require(`../../schemas/users`)
module.exports = {
    name: "afk",
    description: "Go afk!",
    category: "Utils",
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
        const user = await users.findOne({userId: message.author.id})
        if(!user) {
            await users.create({userId: message.author.id})
        }
       setTimeout(async () => {
        const reason = args.join(" ") || "No reason"
        const date = Date.now()

        await users.findOneAndUpdate({userId: message.author.id}, {
            afk: true,
            afk_reason: reason,
            afk_set: date,
        })

        message.reply({content: `${client.custom_emojis.tick} • You are now afk! For ${reason}`})
       }, 1000);
    }
}