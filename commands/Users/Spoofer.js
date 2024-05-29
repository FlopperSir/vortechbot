const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const License = require('../../models/licenseModel.js');
const UsedLicense = require('../../models/usedLicenseModel.js');
const mongoose = require('../../index.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add-spoofer-key")
        .setDescription("Generates a new CleanBan Spoofer Key")
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

            if (availableLicenses.length === 0) {
                return interaction.reply({ content: 'No more license keys available, inform Flopper to restock. ❤️', ephemeral: false });
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
            const channelId = '1242293583613264024'; // Reemplazar con el ID del canal al que deseas enviar el mensaje

            // Obtener el objeto del canal utilizando el ID
            const channel = interaction.client.channels.cache.get(channelId);
            
            if (channel) {
                if (channel) {
                    try {
                        const embedMessage = new EmbedBuilder()
                            .setTitle('***SPOOFER KEY ACTIVATED***')
                            .setDescription(`**CUSTOMER:** ${customerName}\n**STAFF:** ${staffName}\n**KEY:** \`${license.key}\``)
                            .setColor(Colors.Green)
                            .setFooter({ text: "CleanBan & Flopper" })
                            .setTimestamp()
    
                
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
            } else {
                console.error('No se pudo encontrar el canal especificado.');
            }

            // Construir el mensaje de respuesta con la licencia generada
            const embedMessage = new EmbedBuilder()
                .setTitle('***CleanBan Spoofer key has been activated.***')
                .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                .setDescription(`Here is your license:\n\`\`\`${license.key}\`\`\``)
                .setColor(Colors.Green)
                .setFooter({ text: "CleanBan & Flopper" })
                .setTimestamp()
                

            // Enviar el mensaje con el embed
            interaction.reply({ embeds: [embedMessage], ephemeral: false });
        } catch (error) {
            console.error('Error:', error);
            interaction.reply({ content: 'An error occurred while processing your request. Please try again later.', ephemeral: true });
        }
    }
};
