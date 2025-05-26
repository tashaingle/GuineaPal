export interface Stats {
    happiness: number;
    hunger: number;
    health: number;
    energy: number;
    interactionCount?: number;
    lastInteraction?: string;
    dailyInteractions?: {
        [date: string]: number;
    };
    // Add any additional stats as needed
} 