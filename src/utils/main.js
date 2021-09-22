const { connect } = require("mongoose")
const { Client } = require("discord.js")
const { glob } = require("glob")
const { promisify } = require("util")
const globPromise = promisify(glob)
require("dotenv").config()

/**
 * @param {Client} client
 */
 module.exports.loadFeatures = async (client) => {

    // Commands
    const commandFiles = await globPromise(`${process.cwd()}/src/commands/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const directory = splitted[splitted.length - 2];

        if (file.name) {
            const properties = { directory, ...file };
            client.commands.set(file.name, properties);
        }
    });

    // Events
    const eventFiles = await globPromise(`${process.cwd()}/src/events/*/*.js`);
    eventFiles.map((value) => require(value));

    // database
    connect(process.env.db)
    .then(() => {console.log(`Connected to database`)})
    .catch((err) => {console.log(`Failed to connect to database`); console.error(err)})

    
};

module.exports.formatString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

module.exports.formatUnderlines = (underlinedword) => {
    let txt = underlinedword.split("_")
    let words = []
    txt.forEach((str) =>{ 
        words.push(str.charAt(0).toUpperCase() + str.slice(1).toLowerCase())
    })
    return words.join(" ")
}


    /* Slash Commands
    const slashCommands = await globPromise(
        `${process.cwd()}/src/slashCommands.js`
    );

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    client.on("ready", async () => {
        await client.guilds.cache
            .get("replace this with your guild id")
            .commands.set(arrayOfSlashCommands);

    
        // await client.application.commands.set(arrayOfSlashCommands);
    });

    */