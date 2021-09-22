const client = require(`../../../index`)
const guilds = require("../../schemas/guild")
const fetch = require("node-fetch")
const { MessageEmbed } = require("discord.js")
const fs = require('fs')
const ClientSchema = require(`../../schemas/Client`)

client.on('ready', async () => {
    const clientschem = await ClientSchema.findOne({clientId: client.id})
    if(!clientschem) {
        await ClientSchema.create({clientId: client.id})
    }
    console.log(`${client.user.username} is now online.`)
    let totalCommands = 0
    client.commands.forEach((cmd) => {
        totalCommands++
    })
    const activites = [
        {name: `%help | ${client.guilds.cache.size} servers!`, type: "WATCHING"},
        {name: `%help | ${client.users.cache.size} users!`, type: "LISTENING"},
        {name: `%links | ${client.ws.ping}ms`, type: "LISTENING"},
        {name: `%botinfo | ${totalCommands} commands!`, type: "LISTENING"},
    ]
    let activity = 0
    client.user.setPresence({status: "dnd", activity: activites[0]})
    setInterval(() => {
        if(activity === activity.length) return activity = 0;
        activity++
        client.user.setActivity(activites[Math.floor(Math.random() * activites.length)])
    }, 1000 * 35);



    setInterval(() => {
        require(`../../functions/auto_meme`)(client)
        require(`../../functions/member_counter`)(client)
    }, 60000 * 10);

})