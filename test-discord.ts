import { REST, Routes } from 'discord.js';
import {
    AgentRuntime,
    elizaLogger,
    getEnvVariable,
    validateCharacterConfig,
} from "@elizaos/core";

async function testDiscordMembers() {
    try {
        // 1. Set up your credentials
        const API_TOKEN = getEnvVariable("DISCORD_API_TOKEN");
        const GUILD_ID = getEnvVariable("DISCORD_GUILD_ID");
        const ROLE_ID = getEnvVariable("DISCORD_ROLE_ID");

        if (!API_TOKEN || !GUILD_ID) {
            throw new Error('Missing required environment variables');
        }

        // 2. Initialize REST client
        const rest = new REST({ version: "10" }).setToken(API_TOKEN);

        // 3. Fetch guild and members
        const guild = await rest.get(Routes.guild(GUILD_ID));
        const members = await rest.get(Routes.guildMembers(GUILD_ID));

        // 4. Log the results
        console.log('Guild:', guild);
        console.log('Members:', JSON.stringify(members, null, 2));

        // 5. Optional: Test finding a specific member
        const testUsername = 'some_username';
        const member = members.find(m => m.user.username === testUsername);
        console.log('Found member:', member);

    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the test
testDiscordMembers();
