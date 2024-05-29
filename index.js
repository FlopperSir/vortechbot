const fs = require("fs");
const config = require("./utils/config.js") || {
    token: null,
    DevelopmentServerId: null,
    type: "development"
};

const db = require('./utils/database')
const fetch = require('node-fetch')
const {
    REST,
    Client,
    GatewayIntentBits,
    ActivityType,
    Collection,
    EmbedBuilder,
    Routes,
    Partials,
    Colors
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ],
    partials: [Partials.Channel]
});

const mongoose = require('mongoose');

// Configuración de la conexión a la base de datos
const username = 'ucrfabianvindas';
const password = 'u649Mj774gQI5xqW';
const dbName = 'Cluster0'; // Reemplaza con el nombre de tu base de datos

// URL de conexión de MongoDB
const url = `mongodb+srv://${username}:${password}@cluster0.wzwbjra.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// Conexión a la base de datos
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión exitosa a la base de datos'))
    .catch(err => console.error('Error de conexión a la base de datos:', err));

module.exports = mongoose;


const commands = [];
const clientCommands = new Collection();

function readCommandsFromDirectory(directory) {
    const commandFiles = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of commandFiles) {
        if (file.isDirectory()) {
            readCommandsFromDirectory(`${directory}/${file.name}`);
        } else if (file.isFile() && file.name.endsWith(".js")) {
            const command = require(`${directory}/${file.name}`);
            commands.push(command.data.toJSON());
            clientCommands.set(command.data.name, command);
        }
    }
}

readCommandsFromDirectory("./commands");

client.on("error", console.error);

process.on('unhandledRejection', error => {
    console.error('Encountered an unhandled promise rejection', error);
});

client.once('ready', async () => {
    console.clear();
    console.log("Bot is now online.");
    console.log("Currently signed in as:", client.user.tag)

    const CLIENT_ID = client.user.id;

    const rest = new REST().setToken(config.token);

    (async () => {
        try {
            if (config.type === "production") {
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Commands have been incorporated for Global Usage.")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, config.DevelopmentServerId), {
                    body: commands
                })
                console.log(`Command access is now restricted to guild members.`)
            }
        } catch (err) {
            console.error({
                rawError: err.rawError,
                Errors: err["rawError"]["errors"]
            });
        }
    })();

    await setPresence(client, `CleanBan`, { type: ActivityType.Playing, status: 'online' });
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId.startsWith("selectapp_")) {
            const id = interaction.customId.split("_")[1];
            const idFromGuild = interaction.guild ? interaction.guild.id : interaction.user.id;
            const applications = await db.get(`applications_${idFromGuild}`) || [];

            if (applications.length === 0) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("No applications have been added yet.")
                            .setColor(Colors.Red)
                            .setTimestamp()
                    ],
                    ephemeral: false
                });
            }

            const selectedApp = applications.find(app => app.id === id);

            if (!selectedApp) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setDescription("The selected application does not exist.")
                            .setColor(Colors.Red)
                            .setTimestamp()
                    ],
                    ephemeral: false
                });
            }

            db.get(`token_${idFromGuild}`);
            db.set(`token_${idFromGuild}`, selectedApp.sellerkey);

            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`The application \`${selectedApp.application}\` has been selected.`)
                        .setColor(Colors.Green)
                        .setTimestamp()
                ],
                ephemeral: false
            });
        }

        return false;
    }

    if (!interaction.isCommand()) return;

    const command = clientCommands.get(interaction.commandName);

    if (!command) return;

    const idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
    const ephemeral = !interaction.guild;

    // Excluyendo el comando "TEST" de la verificación del rol
    if (interaction.commandName === "steps") {
        const testRole = "Staff"; // Nombre del rol que se requiere para ejecutar el comando "test"

        if (interaction.member && !interaction.member.roles.cache.some(role => role.name === testRole)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`You need the role \`${testRole}\`, rank up in CleanBan and unlock more features.`)
                        .setColor(Colors.Red)
                        .setFooter({ text: "CleanBan" })
                        .setTimestamp()
                ],
                ephemeral: false
            });
        }
        

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Interaction was unsuccessful." })
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "CleanBan.com", iconURL: client.user.displayAvatarURL() })
                ],
                ephemeral: false
            });
        }
        return;
    }
    if (interaction.commandName === "add-spoofer-key") {
        const testRole = "perms"; // Nombre del rol que se requiere para ejecutar el comando "test"

        if (interaction.member && !interaction.member.roles.cache.some(role => role.name === testRole)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`You need the role \`${testRole}\`, rank up in CleanBan and unlock more features.`)
                        .setColor(Colors.Red)
                        .setFooter({ text: "CleanBan" })
                        .setTimestamp()
                ],
                ephemeral: false
            });
        }
        

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Interaction was unsuccessful." })
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "CleanBan.com", iconURL: client.user.displayAvatarURL() })
                ],
                ephemeral: false
            });
        }
        return;
    }
    if (interaction.commandName === "verify-spoofer-key") {
        const testRole = "Staff"; // Nombre del rol que se requiere para ejecutar el comando "test"

        if (interaction.member && !interaction.member.roles.cache.some(role => role.name === testRole)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`You need the role \`${testRole}\`, rank up in CleanBan and unlock more features.`)
                        .setColor(Colors.Red)
                        .setFooter({ text: "CleanBan" })
                        .setTimestamp()
                ],
                ephemeral: false
            });
        }
        

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Interaction was unsuccessful." })
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "CleanBan.com", iconURL: client.user.displayAvatarURL() })
                ],
                ephemeral: false
            });
        }
        return;
    }
    if (interaction.commandName === "verify-license") {
        const testRole = "Staff"; // Nombre del rol que se requiere para ejecutar el comando "test"

        if (interaction.member && !interaction.member.roles.cache.some(role => role.name === testRole)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`You need the role \`${testRole}\`, rank up in CleanBan and unlock more features.`)
                        .setColor(Colors.Red)
                        .setFooter({ text: "CleanBan" })
                        .setTimestamp()
                ],
                ephemeral: false
            });
        }
        

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Interaction was unsuccessful." })
                        .setColor(Colors.Red)
                        .setTimestamp()
                        .setFooter({ text: "CleanBan.com", iconURL: client.user.displayAvatarURL() })
                ],
                ephemeral: false
            });
        }
        return;
    }
    
    // Verificación del rol "perms" antes de ejecutar cualquier otro comando
    const permsRole = "perms"; // Nombre del rol que tiene permisos

    if (interaction.member && !interaction.member.roles.cache.some(role => role.name === permsRole)) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`You need the role \`${permsRole}\`, rank up in CleanBan and unlock more features.`)
                    .setColor(Colors.Red)
                    .setFooter({ text: "CleanBan" })
                    .setTimestamp()
            ],
            ephemeral: false
        });
    }

    await interaction.deferReply({ ephemeral: false });

    let content = `**${interaction.user.username}${interaction.user.discriminator ? ("#" + interaction.user.discriminator) : ''} (ID: ${interaction.user.id})** executed the command \`/${interaction.commandName}\`\n`;

    for (const option of interaction.options._hoistedOptions) {
        content += `\n${option.name} : ${option.value}`;
    }

    let wh_url = await db.get(`wh_url_${idfrom}`)
    if (wh_url != null) {
        var params = {
            content: content
        }
        fetch(wh_url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(params)
        })
    }

    try {
        await command.execute(interaction);
    } catch (err) {
        console.error(err);

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Interaction was unsuccessful." })
                    .setColor(Colors.Red)
                    .setTimestamp()
                    .setFooter({ text: "CleanBan.com", iconURL: client.user.displayAvatarURL() })
            ],
            ephemeral: false
        });
    }
});

async function setPresence(client, text, options = { type: ActivityType.Playing, status: 'online' }) {
    client.user.setPresence({
        activities: [{ name: text, type: options.type }],
        status: options.status,
    });
}

client.login(config.token).catch(err => {
    console.clear();
    if (err.code === "TokenInvalid") {
        console.error("The provided token is invalid. Please review your config.json file or check the Environment Variables if you're not using a JSON config, and attempt again.");
        process.exit(1);
    }
});
