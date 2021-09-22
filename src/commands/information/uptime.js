const { Client, Message, MessageEmbed } = require("discord.js")

module.exports = {
    name: "uptime",
    description: "See lotas uptime",
    category: "Information",
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
        let totalSeconds = client.uptime / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        message.reply({content: `<:icons_colorserververified:884877245141909564> • ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds `})
    }
}