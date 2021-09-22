const { Client, Message, MessageEmbed, version } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "botinfo",
  description: "See information about lota",
  category: "Information",
  aliases: ["bi"],
  // usages: [],
  // botPermissions: [],
  // userPermissions: [],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let totalCommands = 0
    client.commands.each((c) => {
      totalCommands++
    })
    const embed = new MessageEmbed()
    .setTitle(" > " + client.user.username, client.user.displayAvatarURL())
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      { name: "Developer", value: `${require(`../../../package.json`).author}`, inline: true },
      {
        name: "Version",
        value: `${require(`../../../package.json`).version}`,
        inline: true 
      },
      { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
      { name: "Users", value: `${client.users.cache.size}`, inline: true },
      { name: "Channels", value: `${client.channels.cache.size}`, inline: true },
      { name: "Emojis", value: `${client.emojis.cache.size}`, inline: true },
      { name: "Libary", value: `Discord.js: ${version}`, inline: true },
      { name: "Commands", value: `${totalCommands}`, inline: true },
      { name: "Support Server", value: `[\`Join Here\`](https://discord.gg/YX2ErrDwHZ)`, inline: true },
      { name: "Uptime", value: `${days} days, ${hours} hrs, ${minutes} mins, ${seconds} secs`, inline: true },
      {name: "Emoji Servers", value: `**[1](https://discord.gg/VvGSTUT27r)** | **[2](https://discord.gg/V7xq9KVN)** | **[3](https://discord.gg/gMdACZhz2s)** | **[4](https://discord.gg/ChYGVgpKvz)** | **[5](https://discord.gg/vZaSGrrbyq) **`}
    )
    .setColor(client.colors.pink)
      .setFooter(`Lota • Requested by ${message.author.tag}`, client.user.displayAvatarURL())

    message.reply({ embeds: [embed] });
  },
};
