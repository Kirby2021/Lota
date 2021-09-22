const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if(oldChannel.name !== newChannel.name) {
        const guild = await guilds.findOne({guildId: newChannel.guild.id})
        if(guild.member_counter) {
          if(newChannel.id === guild.member_counter_channel) {
            let name = []
            newChannel.name.split("").forEach((x) => {
                    name.push(x)
            })
            let indexs = []
            String(newChannel.guild.memberCount).split("").forEach((n) => {
                indexs.push(name.indexOf(n))
            })
            const newName = newChannel.name.split("").slice(0, indexs[0])
            await guilds.findOneAndUpdate({guildId: newChannel.guild.id}, {
                member_counter_channel_name: newName.join(""),
            })
          }
          
        }
    }
})