import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DiscordSettings {
    channels: string[];
    roles: string[];
    rooms: string[];
}

export default function DiscordSettings() {
    const [settings, setSettings] = useState<DiscordSettings>({
        channels: [],
        roles: [],
        rooms: []
    });

    const handleSave = async () => {
        try {
            const response = await fetch('/api/discord/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });
            // Handle response
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Discord Settings</h1>

            <div className="space-y-6">
                {/* Channels Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Channels</h2>
                    {/* Add channel selection UI */}
                </section>

                {/* Roles Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Roles</h2>
                    {/* Add role selection UI */}
                </section>

                {/* Rooms Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Rooms</h2>
                    {/* Add room selection UI */}
                </section>

                <Button
                    onClick={handleSave}
                    className="w-full"
                >
                    Save Settings
                </Button>
            </div>
        </div>
    );
}
