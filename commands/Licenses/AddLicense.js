const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("add-tpm-key")
		.setDescription("Add key. You must specify the optional parameters the first time. After that they're saved.")
		.addUserOption(option =>
			option.setName('customer')
				.setDescription('customer name')
				.setRequired(true))
		.addUserOption(option =>
			option.setName('staff')
				.setDescription('staff name')
				.setRequired(true))
		.addStringOption(option =>
			option.setName("expiry")
				.setDescription("How many days?")
				.setRequired(false))
		.addStringOption(option =>
			option.setName("level")
				.setDescription("What level?")
				.setRequired(false))
		.addStringOption(option =>
			option.setName("amount")
				.setDescription("What amount?")
				.setRequired(false))
		.addStringOption(option =>
			option.setName("character")
				.setDescription("1 = Random, 2 = Uppercase, 3 = Lowercase")
				.setRequired(false))
		.addStringOption(option =>
			option.setName("note")
				.setDescription("Note, Default is \"Added by CleanBan.com\"")
				.setRequired(false)),

	async execute(interaction) {
		let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
		let ephemeral = !interaction.guild ? false : true;

		let sellerkey = await db.get(`token_${idfrom}`)
		if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`The \`SellerKey\` **Has Not Been Set!**\n In Order To Use This Bot You Must Run The \`setseller\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

		let license_mask = await db.get(`licensemask_${idfrom}`)
		if (license_mask === null) license_mask = "CLEANBAN-******";

		let days = interaction.options.getString("expiry")
		let level = interaction.options.getString("level")
		let amount = interaction.options.getString("amount")
		let character = interaction.options.getString("character") || 1;
		let note = interaction.options.getString("note") || "Flopper";

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

		if (amount > 20) return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Failure').addFields([{ name: 'Reason:', value: `You cannot add more than twenty keys at a time.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })

		if (days) {
			fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=add&expiry=${days}&mask=${license_mask}&level=${level}&amount=${amount}&character=${character}&note=${note}&format=text`)
				.then(async res => {
					const text = await res.text();
					if (!text.includes("message")) {
						// Construir el mensaje del embed
						const embedMessage = new EmbedBuilder()
							.setTitle('***CleanBan TpmBypass - EFI key activated.***')
							.setDescription(`Here is your license:\n\`\`\`${text}\`\`\``)
							.setColor(Colors.Green)
							.setTimestamp()
							.setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")

						// Enviar el mensaje con el embed
						interaction.followUp({ embeds: [embedMessage], ephemeral: true })

						// Guardar información de la licencia
						db.set(`licenseAdd_${idfrom}`, `{ "days": ${days}, "level": ${level}, "amount": ${amount}, "character": ${character}, "note": "${note}" }`);

						const channelId = '1242293583613264024'; // Reemplazar con el ID del canal al que deseas enviar el mensaje

						// Obtener el objeto del canal utilizando el ID
						const channel = interaction.client.channels.cache.get(channelId);

						if (channel) {
							try {
								const embedMessage = new EmbedBuilder()
									.setTitle('***TPM-EFI KEY ACTIVATED***')
									.setDescription(`**CUSTOMER:** ${customerName}\n**STAFF:** ${staffName}\n**KEY:** \`${text}\``)
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
					}
					else {
						let json = JSON.parse(text);
						// Manejar mensaje de error
						interaction.editReply({ content: `**${json.message}**\nYour seller key is likely invalid. Change your seller key with the \`/setseller\` command.`, ephemeral: true });
					}
				});
		}
		else {
			let licenseAdd = await db.get(`licenseAdd_${idfrom}`);
			if (licenseAdd === null) return interaction.editReply({ content: 'No configuration has been saved for adding licenses yet. Please run a command with included parameters and then this will work.', ephemeral: true });

			licenseAdd = JSON.parse(licenseAdd);

			fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=add&expiry=${licenseAdd.days}&mask=${license_mask}&level=${licenseAdd.level}&amount=${licenseAdd.amount}&character=${licenseAdd.character}&note=${licenseAdd.note}&format=text`)
				.then(async res => {
					const text = await res.text();
					if (!text.includes("message")) {
						// Construir el mensaje del embed
						const embedMessage = new EmbedBuilder()
							.setTitle('***CleanBan Bypass - EFI key activated.***')
							.setDescription(`Here is your license:\n\`\`\`${text}\`\`\``)
							.setColor(Colors.Green)
							.setTimestamp()
							.setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
						interaction.followUp({ embeds: [embedMessage], ephemeral: true })
						const channelId = '1242293583613264024'; // Reemplazar con el ID del canal al que deseas enviar el mensaje

						// Obtener el objeto del canal utilizando el ID
						const channel = interaction.client.channels.cache.get(channelId);

						if (channel) {
							try {
								const embedMessage = new EmbedBuilder()
									.setTitle('***TPM-EFI KEY ACTIVATED***')
									.setDescription(`**CUSTOMER:** ${customerName}\n**STAFF:** ${staffName}\n**KEY:** \`${text}\``)
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
					}
					else {
						let json = JSON.parse(text);
						// Manejar mensaje de error
						interaction.editReply({ content: `**${json.message}**\nYour seller key is likely invalid. Change your seller key with the \`/setseller\` command.`, ephemeral: true });
					}


				});
		}
	},
};
