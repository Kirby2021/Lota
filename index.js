const { Client, Intents, Collection } = require("discord.js")
const neko_life = require("nekos.life")
require("dotenv").config()
const client = new Client({
    intents: Object.keys(Intents.FLAGS).filter(f => f.startsWith("GUILD")),
    partials: ['CHANNEL','GUILD_MEMBER','MESSAGE','REACTION','USER'],
    allowedMentions: {repliedUser: false},
    restTimeOffset: 0,
})
module.exports = client;
client.neko_life = new neko_life()
client.commands = new Collection()
client.slashCommands = new Collection()
client.colors = {
    pink: "a78bd2",
    darkpink: "d58d98",
    red: "893238",
    darkred: "5f2a2f"
}
client.custom_emojis = {
    warning: "<:icons_exclamation:884877216511557686>",
    imporant: `<:icons_exclamation:884877216511557686>`,
    tick: "<:icons_Correct:884877215102287933>",
    correct: "<:icons_Correct:884877215102287933>",
    cross: `<:icons_Wrong:884877226124906548>`,
    wrong: `<:icons_Wrong:884877226124906548>`,
    delete: `<:icons_delete:884877222995955732>`,
    bin: `<:icons_delete:884877222995955732>`,
    good_ping: `<:icons_goodping:884877245821358081>`,
    idel_ping: `<:icons_idelping:884877240851107900>`,
    bad_ping: `<:icons_badping:884877250795823145>`,
    ban: `<:icons_ban:884877255459889203>`,
    join: `<:icons_join:884877234647736373>`,
    leave: `<:icons_leave:884877239701876796>`,
    dev_server: `<:icons_colorserververified:884877245141909564>`,
    staff_server: `<:icons_colorstaff:884877251949256794>`
}
client.utils = require(`./src/utils/main.js`)
require("./src/utils/main").loadFeatures(client)
client.login(process.env.token)