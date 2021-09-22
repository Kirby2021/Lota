const { model, Schema } = require("mongoose")

const schema = new Schema({
    // General
    guildId: String,
    premium: {type: Boolean, default: false},
    staff: {type: Boolean, default: false},
    prefix: {type: String, default: "%"},
    snipe_message: {type: Array, default: []},
    auto_nick: {type: String, default: "NONE"},

    // Suggestions
    suggestions: {type: Boolean, default: false},
    suggestions_channel: {type: String, default: "NONE"},

    // Leveling
    leveling: {type: Boolean, default: false},
    leveling_channel: {type: String, default: "NONE"},
    leveling_message: {type: String, default: "Congrats $user.mention$ on reaching level $level$"},
    leveling_roles: {type: Array, default: []},

    // Custom commands
    custom_commands: {type: Array, default: []},

    // Auto responders
    auto_responders: {type: Array, default: []},

    // Auto reactions
    auto_reactions: {type: Array, default: []},

    
    // Auto moderation
    automod_links: {type: Boolean, default: false},
    automod_links_links: {type: Array, default: []},
    automod_links_ignoredchannels: {type: Array, default: []},
    automod_words: {type: Boolean, default: false},
    automod_words_list: {type: Array, default: []},
    anti_alt: {type: Boolean, default: false},


    
    // utils
    auto_meme: {type: Boolean, default: false},
    auto_meme_channel: {type: String, default: "NONE"},

    counting: {type: Boolean, default: false},
    counting_channel: {type: String, default: "NONE"},
    counting_last_number: {type: Number, default: 0},

    
    verification: {type: Boolean, default: false},
    verification_channel: {type: String, default: "NONE"},
    verification_role: {type: String, default: "NONE"},
    verification_message: {type: String, default: "Please type the words below to gain access to the server."},


    member_counter: {type: Boolean, default: false},
    member_counter_channel: {type: String, default: "NONE"},
    member_counter_channel_type: {type: String, default: "GUILD_VOICE"},
    member_counter_channel_name: {type: String, default: "Members: "},


    // Welcome
    welcome: {type: Boolean, default: false},
    welcome_channel: {type: String, default: "NONE"},
    welcome_dmuser: {type: Boolean, default: false},
    welcome_message: {type: String, default: "Welcome $user.mention$"},
    welcome_embed: {type: Boolean, default: false},
    
    // Leave
    leave: {type: Boolean, default: false},
    leave_channel: {type: String, default: "NONE"},
    leave_dmuser: {type: Boolean, default: false},
    leave_message: {type: String, default: "Goodbye $user.mention$"},
    leave_embed: {type: Boolean, default: false},

    // Role management
    role_me: {type: Boolean, default: false},
    role_me_roles: {type: Object, default: {}},

    // Logs
    logging: {type: Boolean, default: false},
    logging_channel: {type: String, default: "NONE"},

    // Applications
    applications: {type: Boolean, default: false},
    applications_list: {type: Array, default: []},
    applications_channel: {type: String, default: "NONE"},

    // Join to create
    jtc: {type: Boolean, default: false},
    jtc_channel: {type: String, default: "NONE"},
    jtc_controls_channel: {type: String, default: "NONE"},
    jtc_controls_message: {type: String, default: "NONE"},

    // Dropdown roles
    dropdownRoles: {type: Array, default: []},
})

module.exports = model("Guilds", schema)