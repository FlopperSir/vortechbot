const { SlashCommandBuilder, Colors, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("steps")
        .setDescription("Deploy the steps of CleanBan Spoofer"),

    async execute(interaction) {
        const ephemeral = false;

        // Creamos el botón "test"
        const testButton = new ButtonBuilder()
            .setCustomId("STEP 1")
            .setLabel("STEP 1")
            .setStyle(ButtonStyle.Primary);

        // Creamos el botón adicional "test2"
        const testButton2 = new ButtonBuilder()
            .setCustomId("STEP 2")
            .setLabel("STEP 2")
            .setStyle(ButtonStyle.Primary);

        const testButton3 = new ButtonBuilder()
            .setCustomId("STEP 3")
            .setLabel("STEP 3")
            .setStyle(ButtonStyle.Primary);

        const testButton4 = new ButtonBuilder()
            .setCustomId("STEP 4-1")
            .setLabel("STEP 4-1")
            .setStyle(ButtonStyle.Primary);

        const testButton5 = new ButtonBuilder()
            .setCustomId("STEP 4-2")
            .setLabel("STEP 4-2")
            .setStyle(ButtonStyle.Primary);

        const testButton6 = new ButtonBuilder() // Nuevo botón adicional
            .setCustomId("STEP 5")
            .setLabel("STEP 5")
            .setStyle(ButtonStyle.Primary);

        const testButton7 = new ButtonBuilder() // Nuevo botón adicional
            .setCustomId("STEP 6")
            .setLabel("STEP 6")
            .setStyle(ButtonStyle.Primary);
            
        const testButton8 = new ButtonBuilder() // Nuevo botón adicional
        .setCustomId("ERROR FIX")
        .setLabel("ERROR FIX")
        .setStyle(ButtonStyle.Primary);

        const testButton9 = new ButtonBuilder() // Nuevo botón adicional
        .setCustomId("STEP 7")
        .setLabel("STEP 7")
        .setStyle(ButtonStyle.Primary);
    const testButton10 = new ButtonBuilder() // Nuevo botón adicional
        .setCustomId("FINISH")
        .setLabel("FINISH")
        .setStyle(ButtonStyle.Primary);

        const Embed = new EmbedBuilder()
            .setTitle(`Hey dear customer ⭐`)
            .setDescription(`
            1️⃣ ***Please follow the steps in order, to avoid mistakes.***

            2️⃣ ***If any program presents an error or does not start correctly, press the error fix BUTTON.***

            3️⃣ ***Remember to read the rules, ignorance of them does not make you invulnerable to consequences.***

            4️⃣ ***Product warranty = 48 HOURS***

            5️⃣ ***Friendly Reminder: If you need help or have errors, let a member of our staff know.***
                `)
            .setColor(Colors.Blue)
            .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
            .setFooter({ text: "CleanBan & Flopper" })
            .setTimestamp();

        // Enviamos la respuesta con los botones "test" y "test2" como parte de la fila de acción
        await interaction.reply({ content: ``, components: [
            new ActionRowBuilder().addComponents(testButton, testButton2, testButton3, testButton4, testButton5), // Primera fila de botones
            new ActionRowBuilder().addComponents(testButton6, testButton7, testButton9,testButton10, testButton8) // Segunda fila de botones adicionales
        ], embeds: [Embed], ephemeral });

        interaction.client.on('interactionCreate', async (buttonInteraction) => {
            // Verificamos si la interacción es un botón y si su identificador personalizado es 'STEP 1' o 'STEP 2'
            if (buttonInteraction.isButton() && (buttonInteraction.customId === 'STEP 1' || buttonInteraction.customId === 'STEP 2' || buttonInteraction.customId === 'STEP 3' || buttonInteraction.customId === 'STEP 4-1' || buttonInteraction.customId === 'STEP 4-2' || buttonInteraction.customId === 'STEP 5' || buttonInteraction.customId === 'STEP 6' || buttonInteraction.customId === 'STEP 7' || buttonInteraction.customId === 'FINISH' || buttonInteraction.customId === 'ERROR FIX')) {
                if (buttonInteraction.customId === 'STEP 1') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 1: Screenshot HWID Serials")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`1. [Download SerialChecker](https://dosya.co/0of56iht88n0/ProperSerialChecker.exe.html)\n2. Right-click and select "Run as administrator.\n3. Screenshot all serials using Windows key + Shift + S \n4. Send screenshot of the HWID serials to this chat`)
                        .setColor(Colors.Green)
						.setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 2') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 2: CB-Loader")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`1. [Download CB-Loader](https://dosya.co/bmqn35ux2u49/CleanBan.exe.html)\n2. Right-click and select "Run as administrator.\n3. Enter your license key.\n4. Start Spof.\n5. Allow the application to complete its process.\n6. Restart Your PC.\n7. Once your PC has restarted, run the Serialchecker file. Capture a screenshot of the output. `)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 3') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 3: Flash-Bios - Watch Videos")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`1. NOTE: Flash BIOS (either upgrade or downgrade from the version you are currently banned on).\n2. Download the latest BIOS version for your exact motherboard model online (find your motherboard model in MSINFO next to the "Baseboard Product" section) \n3. Format your USB to FAT32.\n4. Extract the downloaded zipped file to your USB drive.\n5. Restart your PC and boot into BIOS\n6. In the BIOS, use the search option and look for "flash" or similar terms.\n7. Select the BIOS flash update option (e.g., EZ Flash 3, Fast Flash, M-Flash) from the search results.\n8. Choose the BIOS version you downloaded from the USB directory.\n9. Begin the BIOS flash process.\n10. After the first flash and when you're back in the BIOS, flash again for the last time.\n\n⭐ [Asus video tutorial](https://www.youtube.com/watch?v=fU-TS9GjECU)\n⭐ [Msi video tutorial](https://www.youtube.com/watch?v=HNj1tQW5Tbg)\n⭐ [Gigabyte video tutorial](https://www.youtube.com/watch?v=lRM6UDKqeAQ)\n⭐ [ASrock video tutorial](https://www.youtube.com/watch?v=YsT45YUPhHs)`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                }
                else if (buttonInteraction.customId === 'STEP 4-1') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 4-1: Prepare Windows Installation - Watch video")
                    .setURL("https://streamable.com/5fgfub")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`1. Download and run the Media Creation Tool\n2. Choose "Create installation media (USB flash drive, DVD, or ISO file) for another PC."\n3. Follow the recommended options and select USB flash drive (minimum 8 GB). This will erase all data on the USB drive.\n4. [Download Rufus](https://rufus.ie/) and run it.\n5. Select the USB flash drive under "Device" in Rufus.\n6. Click "Select" next to "Boot selection" and navigate to the previously downloaded Windows 10 ISO file.\n7. Configure other settings as desired, ensuring the correct partition scheme = GPT , and file system = NTFS\n8. Click "Start" and confirm that all data on the USB drive will be erased.\n9. When finished, you will see Status READY > click CLOSE`)
                        .setColor(Colors.Green)
                        .setImage('https://images-ext-1.discordapp.net/external/gcr0uM1v6HNaABIJitx2La2w-o1dV8ke3B7kOggFV8k/https/i.imgur.com/UCqBy8m.png?format=webp&quality=lossless&width=556&height=676');
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 4-2') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 4-2: Install Windows - Watch video")
                    .setURL("https://streamable.com/687ky2")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`1. Boot into your USB via BIOS.\n2. Start the Windows 10 installation process and press Shift + F10 to open the Command Prompt (CMD) during installation."\n3. In the Command Prompt, type diskpart and press Enter.\n4. Enter list disk to display all available hard drives. Identify and select the disks by typing select disk <disk number> (e.g., select disk 0).\n5. Type clean and press Enter to wipe the selected disk.\n6. Clean all drives EXCEPT YOUR USB drive. Don’t touch the USB drive.\n7. Exit Diskpart by typing exit and pressing Enter.\n8. Close the Command Prompt and proceed with the Windows 10 installation.\n9. Select "Windows 10 Pro" and choose "I don't have a product key.\n10. Opt for "Custom: Install Windows only (advanced)."\n11. Select your main drive and click Next.\n12. Continue with the setup process and complete the installation of Windows.\n\n**Note for EAC + RICOCHET**\nDo not log in to the following applications with existing accounts, create new accounts for each of these services or just don’t login:\n\n1️⃣. Windows user account, Microsoft account\n2️⃣. Nvidia Experience\n3️⃣. OneDrive\n4️⃣. Logitech G Hub, Steelseries, Razer or similar software"`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 5') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 5: Change MAC Adress - Watch Video")
                    .setURL("https://www.youtube.com/watch?v=bvvXq4jeif8")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`1. Download Technitium MAC Address Changer from [TMAC Download](https://download.technitium.com/tmac/TMACv6.0.7_Setup.zip).\n2. Extract the downloaded zip file."\n3. Run TMAC_Setup.exe to install the Technitium MAC Address Changer.\n4. After installation, press the Windows key and search for "TMAC."\n5. Run TMAC as administrator.\n6. If prompted, press NO to avoid associating ".tpf" files with TMAC.\n7. Change the MAC Address for the following adapters:\n8. Wifi, Ethernet, Kerneldebugger.\n9. Restart your computer after changing all MAC addresses.\n10. Once you are back, run serialchecker and caputre a screenshot of the output and send to ticket.`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 6') { 
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 6: Spoof monitor serials - Watch Video")
                    .setURL("https://streamable.com/6ibjqa")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                        .setDescription(`1. [Download CRU](https://www.monitortests.com/download/cru/cru-1.5.2.zip)\n2. Watch the video and follow the steps.\n3. Don't copy the same serials from the video, create your own."\n4. If your screen goes black, do this:\n\n1️⃣. Turn on pc.\n2️⃣. Unplug all monitors.\n3️⃣. Turn off pc\n4️⃣. Turn pc back on.\n5️⃣. Replug all monitors.`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'ERROR FIX') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("ERROR FIX: If you have an error in any program, do this.")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`**1. Disable UAC (User Account Control):**\n° Press the Windows key."\n° Search for "User Account Control" or "UAC".\n° Slide the slider all the way down to disable UAC.\n° Press "Ok" in the bottom right to confirm.\n° Take a screenshot and send to ticket.\n\n**2. Download and Run dControl:**\n° [Download dControl.](https://www.sordum.org/files/downloads.php?st-defender-control).\n ° Unzip the file (password: sordum).\n° Run dControl.exe.\n° Disable Windows Defender until it's shown as red.\n° Take a screenshot of Defender Control being disabled.\n\n**3. Download and Run WUB (Windows Update Blocker):**\n° [Download WUB.](https://www.sordum.org/downloads/?st-windows-update-blocker)\n° Unzip the file.\n° Run the WUB x64 executable.\n° Disable Windows updates.\n° Take a screenshot of Windows Updates being disabled.\n\n**4. Install all Visual C++ Redistributable packages.**\n° Download and install from this link: [Visual C++ Redist Packages.](https://www.techpowerup.com/download/visual-c-redistributable-runtime-package-all-in-one/)\n° Extract files to desktop.\n° Open ''INSTALL ALL'' as administrator.`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                } 
                else if (buttonInteraction.customId === 'STEP 7') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("Step 7: Configure BIOS settings.")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`1. Go to BIOS.\n2. Press the Windows key."\n3. Navigate to "Advanced" settings.\n4. Find "Trusted Computing" and set the "Security Device Support" item to [Disable].\n\n**Disable WiFi & Bluetooth**\n1. **Navigate to the Wireless settings:** Once in the BIOS setup utility, navigate through the menus using the arrow keys. Look for a menu related to "Peripheral Devices," "Integrated Peripherals," "Advanced," or something similar. The exact naming may vary.\n2. **Locate Wi-Fi and Bluetooth settings:** Within the relevant menu, you should find options related to wireless devices. These options may be labeled as "Wi-Fi," "Wireless LAN," "Bluetooth," or similar.\n3. **Disable Wi-Fi and Bluetooth:** Once you've located the Wi-Fi and Bluetooth settings, there should be options to enable or disable them. Use the arrow keys to highlight the Wi-Fi and Bluetooth options and toggle them to "Disabled" or "Off."\n4. **Save and Exit:** After disabling Wi-Fi and Bluetooth, navigate to the option to save your changes and exit the BIOS setup utility. This option is usually labeled as "Save and Exit," "Exit and Save Changes," or something similar. Follow the prompts to confirm and exit the BIOS.\n\nNote: The exact location of these settings can vary depending on your motherboard and BIOS version.\n\n**Post-Action Steps:**\n° Once back in Windows, open tpm.msc.\n° Send a screenshot of TPM.MSC to chat.`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                }
                else if (buttonInteraction.customId === 'FINISH') {
                    // Creamos el embed con el mensaje específico
                    const embed = new EmbedBuilder()
                    .setTitle("FINISHED: Read this CAREFULLY.")
                    .setThumbnail("https://media.discordapp.net/attachments/1075134714886770763/1241558470394773504/CLEAN_BAN_1.png?ex=664aa2ee&is=6649516e&hm=c704c3172af1b6f200eaac8035445f0998e485c0b58dbc7f2443d49d4c5b861f&=&format=webp&quality=lossless")
                    .setDescription(`1. Delete the "Loader", “serialchecker”, and uninstall TMAC v6/Smart DNS if you have it installed.\n2. For Valorant, the TPM BYPASS or NEW CHIP is NECESSARY, do not start Valorant even without first asking about it.\n3. MUST use a brand new created account..\n4. Please test without cheats for 24hrs to ensure the spoof worked and to ensure it wasn’t any detected cheats that got you banned.\n\n**DISCLAIMER:**\n\n1. Failing to listen and not using a BRAND NEW account will result in immediate NO refund or FREE respoof as you did not listen.\n2. MUST repurchase if needed`)
                        .setColor(Colors.Green)
                        .setFooter({ text: "CleanBan & Flopper" })
                        .setTimestamp();
                        
                        
                    // Enviamos el embed
                    await buttonInteraction.reply({ embeds: [embed] });
                    
                }  
                // Agrega más casos para otros botones aquí si es necesario...
            }
        });
    },  
};
