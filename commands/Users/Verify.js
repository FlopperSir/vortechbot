const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const License = require('../../models/licenseModel.js');
const UsedLicense = require('../../models/usedLicenseModel.js');
const mongoose = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("verify-spoofer-key")
    .setDescription("Verify a Vortech Spoofer Key")
        .addStringOption(option =>
            option.setName('license_key')
                .setDescription('The Vortech Spoofer Key to verify')
                .setRequired(true)),

                async execute(interaction) {
                    try {
                        const licenseKey = interaction.options.getString('license_key');
                
                        // Buscar la licencia en la base de datos
                        const license = await UsedLicense.findOne({ key: licenseKey });

                        if (!license) {
                            const embedMessage = new EmbedBuilder()
                                .setTitle('***Spoofer Key Verification***')
                                .setDescription(`This key is invalid or has not yet been used:\n\nkey: \`${licenseKey}\``)
                                .setColor(Colors.Red)
                                .setThumbnail("https://cdn.discordapp.com/attachments/1245559420314845195/1245832018323832832/ud.png?ex=665a2efb&is=6658dd7b&hm=d9b66e6cf8fb8ee96a61d87ef1e81caccd951c4ac4a837e258c0d5db0bb439b6&")
                                .setFooter({ text: "Vortech & Flopper" })
                                .setTimestamp();
                            return interaction.reply({ embeds: [embedMessage] });
                        } else {
                            
                        }
                        
                
                        // Comprobar si la licencia ha sido utilizada
                        if (license.used) {
                            // Si ha sido utilizada, buscar la información en la base de datos secundaria
                            const usedLicenseInfo = await UsedLicense.findOne({ key: licenseKey });
                
                            // Construir el mensaje de respuesta con la información de la licencia utilizada
                            const embedMessage = new EmbedBuilder()
                                .setTitle('***Spoofer Key Verification***')
                                .setDescription(`This license key has already been used:\n\nCustomer: ${usedLicenseInfo.customer}\nkey: \`${license.key}\``)
                                .setColor(Colors.DarkPurple)
                                .setThumbnail("https://cdn.discordapp.com/attachments/1245559420314845195/1245832018323832832/ud.png?ex=665a2efb&is=6658dd7b&hm=d9b66e6cf8fb8ee96a61d87ef1e81caccd951c4ac4a837e258c0d5db0bb439b6&")
                                .setFooter({ text: "Vortech & Flopper" })
                                .setTimestamp();
                
                            // Enviar el mensaje con el embed
                            return interaction.reply({ embeds: [embedMessage], ephemeral: false });
                        } else {
                            // Si no ha sido utilizada, informar que la licencia está disponible
                            return interaction.reply({ content: 'This license key is valid and available for use.', ephemeral: true });
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        return interaction.reply({ content: 'ERROR ASK TO FLOPPER TO FIX IT.', ephemeral: true });
                    }
                }
};
