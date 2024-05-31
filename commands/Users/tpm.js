const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const mongoose = require('../../index.js');

// Modelos de mongoose para las colecciones de claves
const tpm1License = mongoose.model('tpm1License', new mongoose.Schema({
    key: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        default: false
    }
}));

const tpm2License = mongoose.model('tpm2License', new mongoose.Schema({
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
        .setName("add-tpm")
        .setDescription("Generates a new Vortech tpm Key")
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('Enter the duration of the key (week or lifetime)')
                .setRequired(true)),

    async execute(interaction) {
        const duration = interaction.options.getString('duration');
        const durations = ['week', 'lifetime'];

        if (!durations.includes(duration)) {
            return interaction.reply({ content: 'Invalid duration selected. Please enter week or lifetime.', ephemeral: true });
        }
        
        let licenseModel;
        let collectionName;
        let durationText;

        switch (duration) {
            case 'week':
                licenseModel = tpm1License;
                collectionName = 'tpm1';
                durationText = 'week';
                break;
            case 'lifetime':
                licenseModel = tpm2License;
                collectionName = 'tpm2';
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
                .setTitle(`***Vortech TPM key (${durationText}) has been activated.***`)
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
