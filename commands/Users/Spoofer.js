const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const License = require('../../models/licenseModel.js');
const UsedLicense = require('../../models/usedLicenseModel.js');
const mongoose = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-spoofer-key")
        .setDescription("Generates a new Vortech Spoofer Key")
        .addUserOption(option =>
            option.setName('customer')
                .setDescription('Customer name')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('staff')
                .setDescription('Staff name')
                .setRequired(true)),

    async execute(interaction) {
        const customerUser = interaction.options.getUser('customer');
        const staffUser = interaction.options.getUser('staff');

        // Obtener el nombre del cliente
        let customerName = 'N/A';
        if (customerUser) {
            customerName = customerUser.username;
        }

        // Obtener el nombre del personal
        let staffName = 'N/A';
        if (staffUser) {
            staffName = staffUser.username;
        }

        try {
            // Obtener todas las llaves disponibles (no utilizadas)
            const availableLicenses = await License.find({ used: false }, 'key');

            if (availableLicenses.length <= 25) {
                const warningChannelId = '1245870396650164235'; // ID del canal para enviar el mensaje de advertencia
                
                const warningChannel = interaction.client.channels.cache.get(warningChannelId);
                
                if (warningChannel) {
                    try {
                        const warningMessage = `***Warning: Low License Key Supply VORTECH***\nThere are only ${availableLicenses.length} license keys left. @everyone\n\nVortech & Flopper`;
                        
                        warningChannel.send(warningMessage)
                            .then(async () => {
                                console.log('Mensaje de advertencia enviado al canal exitosamente.');
                                
                                // Enviar el mensaje a los DMs de 3 personas específicas
                                const user1 = await interaction.client.users.fetch(''); // ID de usuario 1
                                const user2 = await interaction.client.users.fetch(''); // ID de usuario 2
                                const user3 = await interaction.client.users.fetch(''); // ID de usuario 3
                                
                                if (user1 && user2 && user3) {
                                    user1.send(warningMessage);
                                    user2.send(warningMessage);
                                    user3.send(warningMessage);
                                }
                            })
                            .catch(error => {
                                console.error('Error al enviar mensaje de advertencia al canal:', error);
                            });
                    } catch (error) {
                        console.error('Error al intentar enviar mensaje de advertencia al canal:', error);
                    }
                } else {
                    console.error('No se pudo encontrar el canal de advertencia especificado.');
                }
            }
            
            if (availableLicenses.length <= 100) {
                const warningChannelId = '1245870396650164235'; // ID del canal para enviar el mensaje de advertencia

                const warningChannel = interaction.client.channels.cache.get(warningChannelId);

                if (warningChannel) {
                    try {
                        const warningMessage = new EmbedBuilder()
                            .setTitle('***Key Supply ``VORTECH``***')
                            .setDescription(`There are only ${availableLicenses.length} license keys left`)
                            .setColor(Colors.Orange)
                            .setFooter({ text: "Vortech & Flopper" })
                            .setTimestamp();

                        warningChannel.send({ embeds: [warningMessage] })
                            .then(async () => {
                                console.log('Mensaje de advertencia enviado al canal exitosamente.');

                                // Enviar el mensaje a los DMs de 3 personas específicas
                                const user1 = await interaction.client.users.fetch('');
                                const user2 = await interaction.client.users.fetch('');
                                const user3 = await interaction.client.users.fetch('');

                                if (user1 && user2 && user3) {
                                    user1.send({ embeds: [warningMessage] });
                                    user2.send({ embeds: [warningMessage] });
                                    user3.send({ embeds: [warningMessage] });
                                }
                            })
                            .catch(error => {
                                console.error('Error al enviar mensaje de advertencia al canal:', error);
                            });
                    } catch (error) {
                        console.error('Error al intentar enviar mensaje de advertencia al canal:', error);
                    }
                } else {
                    console.error('No se pudo encontrar el canal de advertencia especificado.');
                }
            }

            if (availableLicenses.length === 0) {
                return interaction.reply({ content: 'Bot currently down. ❤️', ephemeral: false });
            }

            // Elegir una licencia aleatoria de las disponibles
            const randomIndex = Math.floor(Math.random() * availableLicenses.length);
            const license = availableLicenses[randomIndex];

            // Marcar la licencia como utilizada en la base de datos principal
            license.used = true;
            await license.save();

            // Guardar la información de la licencia utilizada en la base de datos secundaria
            await UsedLicense.create({
                key: license.key,
                customer: customerName, // Usar el nombre del cliente obtenido
                staff: staffName, // Usar el nombre del personal obtenido
                usedAt: new Date()
            });

            const channelId = '1245705423722647572'; // Reemplazar con el ID del canal al que deseas enviar el mensaje

            // Obtener el objeto del canal utilizando el ID
            const channel = interaction.client.channels.cache.get(channelId);

            if (channel) {
                try {
                    const embedMessage = new EmbedBuilder()
                        .setTitle('***SPOOFER KEY ACTIVATED***')
                        .setDescription(`**CUSTOMER:** ${customerName}\n**STAFF:** ${staffName}\n**KEY:** \`${license.key}\``)
                        .setColor(Colors.DarkPurple)
                        .setFooter({ text: "Vortech & Flopper" })
                        .setTimestamp();

                    // Enviar el mensaje con el embed
                    channel.send({ embeds: [embedMessage] })
                        .then(() => {
                            console.log('Mensaje enviado al canal exitosamente.');
                        })
                        .catch(error => {
                            console.error('Error al enviar mensaje al canal:', error);
                        });
                } catch (error) {
                    console.error('Error al intentar enviar mensaje al canal:', error);
                }
            } else {
                console.error('No se pudo encontrar el canal especificado.');
            }

            // Construir el mensaje de respuesta con la licencia generada
            const embedMessage = new EmbedBuilder()
                .setTitle('***Vortech Spoofer key has been activated.***')
                .setThumbnail("https://cdn.discordapp.com/attachments/1245559420314845195/1245832018323832832/ud.png?ex=665a2efb&is=6658dd7b&hm=d9b66e6cf8fb8ee96a61d87ef1e81caccd951c4ac4a837e258c0d5db0bb439b6&")
                .setDescription(`Here is your license:\n\`\`\`${license.key}\`\`\``)
                .setColor(Colors.DarkPurple)
                .setFooter({ text: "Vortech & Flopper" })
                .setTimestamp();

            // Enviar el mensaje con el embed
            interaction.reply({ embeds: [embedMessage], ephemeral: false });
        } catch (error) {
            console.error('Error:', error);
            interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    }
};
