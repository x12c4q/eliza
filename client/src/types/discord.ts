export interface DiscordChannel {
    id: string;
    name: string;
    type: string;
}

export interface DiscordRole {
    id: string;
    name: string;
}

export interface DiscordRoom {
    id: string;
    name: string;
}

export interface DiscordSettings {
    channels: string[];
    roles: string[];
    rooms: string[];
}
