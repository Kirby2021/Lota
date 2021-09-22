const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
client.on("guildDelete", async  (guild) => {
    await guilds.findOneAndReplace({guildId: guild.id})
})