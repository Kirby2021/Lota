const client = require(`../../../index`)
const guilds = require(`../../schemas/guild`)
client.on("guildCreate", async  (guild) => {
    await guilds.create({guildId: guild.id})
})