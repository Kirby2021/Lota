const { MessageEmbed, version, MessageActionRow, MessageSelectMenu } = require("discord.js")
const client = require(`../../../index`)
const fs = require('fs')
let dirEmojis = require(`../../utils/diremojis`)
const disabled = client.custom_emojis.cross
const enabled = client.custom_emojis.tick
client.on("interactionCreate", (interaction) => {
  if(interaction.isSelectMenu()) {
    if(interaction.customId === "help_menu") {
   
      if(interaction.values[0].toLowerCase() === "nsfw") {
        if(interaction.channel.nsfw) {
          const embed = new MessageEmbed()
          .setTitle(` > ${dirEmojis[interaction.values[0].toLowerCase()]} • ${client.utils.formatUnderlines(interaction.values[0].toLowerCase())}`)
          .setDescription(client.commands.filter((cmd) => cmd.category.toLowerCase() === interaction.values[0].toLowerCase()).map((cmd) => ` > [\`${cmd.name}\`]`).join("\n"))
          .setColor(client.colors.pink)
          interaction.deferUpdate()
            return interaction.message.edit({embeds: [embed]})
        } else {
          return interaction.reply({content: `${client.custom_emojis.cross} • This can only be seen in NSFW channels!`, ephemeral: true})
        }
      } else {
        if(interaction.values[0].toLowerCase() === "statistics") {
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
      
            interaction.deferUpdate()
            return interaction.message.edit({embeds: [embed]})

        }
        if(interaction.values[0].toLowerCase() === "general") {
          let categorys = []
          let dropdowns = []
          dropdowns.push({
              label: `General`,
              emoji: `${client.custom_emojis.warning}`,
              description: `Click to see the general section!`,
              value: `general`
          })
          dropdowns.push({
              label: `Statistics`,
              emoji: `${client.custom_emojis.warning}`,
              description: `Click to see the statistics section!`,
              value: `statistics`
          })
          categorys.push(` > ${client.custom_emojis.warning} **• General**\n > ${client.custom_emojis.warning} **• Statistics**\n`)
          fs.readdirSync(`${process.cwd()}/src/commands`).forEach((dir) => {
              let dirEmojis = require(`../../utils/diremojis`)
              const commandLength = fs.readdirSync(`${process.cwd()}/src/commands/${dir}`).length
              dropdowns.push({
                  label: `${client.utils.formatUnderlines(dir)}`,
                  emoji: `${dirEmojis[dir.toLowerCase()]}`,
                  description: `Click this to get ${dir.toLowerCase()} commands!`,
                  value: `${dir.toLowerCase()}`
              })
              categorys.push(` > ${dirEmojis[dir.toLowerCase()]} **• ${client.utils.formatUnderlines(dir.toLowerCase())}** - ${commandLength} commands!`)
             
          })
          
  
          let row = new MessageActionRow()
          .addComponents([
              new MessageSelectMenu()
              .setPlaceholder("Choose...")
              .setCustomId("help_menu")
              .addOptions(dropdowns)
          ])
      
          
          const embed = new MessageEmbed()
          .setTitle(` > ${client.user.username}'s help panel!`)
          .setDescription(`${categorys.join("\n")}`)
          .setColor(client.colors.pink)
          .setFooter(`Lota • Requested by ${interaction.user.tag}`, client.user.displayAvatarURL())
  
          interaction.deferUpdate()
            return interaction.message.edit({embeds: [embed], components: [row]})
        }

        let longestCommandLength = 0
        client.commands.filter((cmd) => cmd.category.toLowerCase() === interaction.values[0].toLowerCase()).map((cmd) => {
          if(cmd.name.length > longestCommandLength) {
            longestCommandLength = cmd.name.length + 1
          }
        })


        const embed = new MessageEmbed()
        .setTitle(` ${dirEmojis[interaction.values[0].toLowerCase()]} • ${client.utils.formatUnderlines(interaction.values[0].toLowerCase())}`)
        .setDescription(`${client.commands.filter((cmd) => cmd.category.toLowerCase() === interaction.values[0].toLowerCase()).map((cmd) => `> \`${cmd.name}${" ".repeat(longestCommandLength - Number(cmd.name.length))}:\` ${cmd.description.split("").slice(0, 49).join("")}`).join("\n")}`)
        .setColor(client.colors.pink)
        interaction.deferUpdate()
          return interaction.message.edit({embeds: [embed]})
      }
    }
  }
})