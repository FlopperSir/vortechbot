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
const dbName = 'Vortech'; // Reemplaza con el nombre de tu base de datos

// URL de conexión de MongoDB
const url = `mongodb+srv://${username}:${password}@Vortech.wzwbjra.mongodb.net/${dbName}?retryWrites=true&w=majority`;

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

    await setPresence(client, `Vortech`, { type: ActivityType.Playing, status: 'online' });
});

// Función para verificar el rol requerido antes de ejecutar un comando
async function checkRoleAndExecute(interaction, command, requiredRole) {
    if (interaction.member && !interaction.member.roles.cache.some(role => role.name === requiredRole)) {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setThumbnail("https://cdn.discordapp.com/attachments/1245559420314845195/1245832018323832832/ud.png?ex=665a2efb&is=6658dd7b&hm=d9b66e6cf8fb8ee96a61d87ef1e81caccd951c4ac4a837e258c0d5db0bb439b6&")
                    .setDescription(`You need the role \`${requiredRole}\`, rank up in Vortech and unlock more features.`)
                    .setColor(Colors.Red)
                    .setFooter({ text: "Vortech" })
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
                    .setFooter({ text: "Vortech.com", iconURL: client.user.displayAvatarURL() })
            ],
            ephemeral: false
        });
    }
}

// Aquí se maneja la interacción
client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        // Código para botones...
    } else if (interaction.isCommand()) {
        const command = clientCommands.get(interaction.commandName);
        if (!command) return;

        const idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        const ephemeral = !interaction.guild;

        // Verificación del rol requerido para diferentes comandos
        switch (interaction.commandName) {
            case "steps":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "add-spoofer-key":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "verify-spoofer-key":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "add-myth":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "add-tpm":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "verify-license":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            case "add-color":
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
            default:
                // Verificación del rol "Admin" antes de ejecutar cualquier otro comando
                await checkRoleAndExecute(interaction, command, "Admin");
                break;
        }
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
