const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('./config.json');
const { guildCommands } = require('./commands')

const rest = new REST({ version: '10' }).setToken(config.token);
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {

    const guilds = client.guilds.cache.map(guild => guild.id);
    guilds.forEach(async guild => {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, guild),
            { body: guildCommands },
        );
    })

    console.log("The bot is now online!");

    // Check and route a command.
    client.on('interactionCreate', async interaction => {
        switch (interaction.commandName) {
            case 'ping': ping(interaction); break;
            case 'commentator': commentator(interaction); break;
        }
    });

    function ping(interaction) {
        interaction.reply({ content: '`' + -(interaction.createdTimestamp - Date.now()) + '` ms', ephemeral: true });
    }

    function commentator(interaction) {
        if (!interaction.member.roles.cache.has(config.commentator.roleToHave) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ content: `You do not have permission to execute this command.`, ephemeral: true });
        let role = interaction.guild.roles.cache.find(role => role.id === config.commentator.roleToGive);
        switch (interaction.options.getString('action')) {
            case 'add': addCommentator(); break;
            case 'remove': removeCommentator(); break;
        }

        function addCommentator() {
            try {
                let user = interaction.guild.members.cache.get(interaction.options.getUser('user').id)
                user.roles.add(config.commentator.roleToGive);
                interaction.reply({ content: `Commentator role added to <@${interaction.options.getUser('user').id}>`, ephemeral: true });
            } catch (e) {
                console.log(e)
                interaction.reply({ content: 'Role not found.', ephemeral: true })
            }
        }

        function removeCommentator() {
            try {
                let user = interaction.guild.members.cache.get(interaction.options.getUser('user').id)
                user.roles.remove(config.commentator.roleToGive);
                interaction.reply({ content: `Commentator role removed from <@${interaction.options.getUser('user').id}>`, ephemeral: true });
            } catch (e) {
                console.log(e)
                interaction.reply({ content: 'Role not found.', ephemeral: true })
            }
        }
    }
});

client.login(config.token)