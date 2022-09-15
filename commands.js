const { SlashCommandBuilder } = require('@discordjs/builders'); 

const guildCommands = [
    new SlashCommandBuilder()
    .setName('commentator')
    .setDescription('Add or remove a commentator for a run.')
    .addStringOption(option =>
        option.setName('action')
        .setDescription('Test!')
        .addChoices(
            { name: 'add', value: 'add' },
            { name: 'remove', value: 'remove' }
        )
        .setRequired(true)
    )
    .addUserOption(option => 
        option.setName('user')
        .setDescription('The affected user.')
        .setRequired(true)
    ),
    new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Test response time to the server')
].map(command => command.toJSON());

module.exports = { guildCommands }