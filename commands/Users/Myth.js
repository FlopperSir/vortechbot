const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const mongoose = require('../../index.js');

// Modelos de mongoose para las colecciones de claves
const Myth1License = mongoose.model('Myth1License', new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}));

const Myth2License = mongoose.model('Myth2License', new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}));

const Myth3License = mongoose.model('Myth3License', new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-myth")
        .setDescription("Generates a new Vortech Myth Key")
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Enter the duration of the key (day, week, or month)')
                .setRequired(true)),

    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const durations = ['day', 'week', 'month'];

        if (!durations.includes(duration)) {
            return interaction.reply({ content: 'Invalid duration selected. Please enter day, week, or month.', ephemeral: true });
        }
        
        let licenseModel;
        let collectionName;
        let durationText;

        switch (duration) {
            case 'day':
                licenseModel = Myth1License;
                collectionName = 'Myth1';
                durationText = 'day';
                break;
            case 'week':
                licenseModel = Myth2License;
                collectionName = 'Myth2';
                durationText = 'month';
                break;
            case 'month':
                licenseModel = Myth3License;
                collectionName = 'Myth3';
                durationText = 'lifetime';
                break;
        }

        try {
            const availableLicenses = await licenseModel.find({ used: false }, 'key');
            
            if (availableLicenses.length === 0) {
                return interaction.reply({ content: 'No stock ask to Vortech to restock ❤️', ephemeral: false });
            }

            const randomIndex = Math.floor(Math.random() * availableLicenses.length);
            const license = availableLicenses[randomIndex];
            
            license.used = true;
            await license.save();

            const embedMessage = new EmbedBuilder()
                .setTitle(`***Vortech Myth key (${durationText}) has been activated.***`)
                .setThumbnail("https://cdn.discordapp.com/attachments/1245559420314845195/1245832018323832832/ud.png?ex=665a2efb&is=6658dd7b&hm=d9b66e6cf8fb8ee96a61d87ef1e81caccd951c4ac4a837e258c0d5db0bb439b6&")
                .setDescription(`Here is your license:\n\`\`\`${license.key}\`\`\``)
                .setColor(Colors.DarkPurple)
                .setFooter({ text: "Vortech & Flopper" })
                .setTimestamp();

            interaction.reply({ embeds: [embedMessage], ephemeral: false });
        } catch (error) {
            console.error('Error:', error);
            interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    }
};
