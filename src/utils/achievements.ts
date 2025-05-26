import { Stats } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    requirement: (stats: Stats) => boolean;
    reward?: {
        type: 'item' | 'currency' | 'cosmetic';
        value: string | number;
    };
    progress?: (stats: Stats) => number;
    unlocked?: boolean;
    unlockedAt?: string;
}

const ACHIEVEMENTS_KEY = '@guinea_pal_achievements';

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_interaction',
        title: 'First Steps',
        description: 'Add your first guinea pig',
        icon: '🐹',
        requirement: (stats) => (stats.interactionCount || 0) > 0
    },
    {
        id: 'care_master',
        title: 'Care Master',
        description: 'Complete all daily care tasks for a week',
        icon: '⭐',
        requirement: (stats) => {
            const minThreshold = 80;
            return (
                stats.happiness >= minThreshold &&
                stats.hunger >= minThreshold &&
                stats.health >= minThreshold &&
                stats.energy >= minThreshold
            );
        }
    },
    {
        id: 'social_butterfly',
        title: 'Social Butterfly',
        description: 'Share 10 photos on GuineaGram',
        icon: '🦋',
        requirement: (stats) => (stats.interactionCount || 0) >= 100,
        progress: (stats) => Math.min(100, ((stats.interactionCount || 0) / 100) * 100)
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Play with your pet during night time',
        icon: '🦉',
        requirement: (stats) => {
            const hour = new Date().getHours();
            return hour >= 22 || hour < 6;
        }
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Feed your pet early in the morning',
        icon: '🐦',
        requirement: (stats) => {
            const hour = new Date().getHours();
            return hour >= 6 && hour < 9;
        }
    },
    {
        id: 'healthy_diet',
        title: 'Healthy Diet',
        description: 'Keep hunger above 90% for a week',
        icon: '🥕',
        requirement: (stats) => stats.hunger >= 90,
        progress: (stats) => Math.min(100, (stats.hunger / 90) * 100)
    },
    {
        id: 'exercise_champion',
        title: 'Exercise Champion',
        description: 'Play with your pet 10 times in one day',
        icon: '🏃',
        requirement: (stats) => {
            const today = new Date().toDateString();
            return ((stats?.dailyInteractions || {})[today] || 0) >= 10;
        },
        progress: (stats) => {
            const today = new Date().toDateString();
            return Math.min(100, (((stats.dailyInteractions || {})[today] || 0) / 10) * 100);
        }
    }
];

export const loadAchievements = async (): Promise<Achievement[]> => {
    try {
        const savedAchievements = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
        if (savedAchievements) {
            const parsed = JSON.parse(savedAchievements);
            // Merge saved unlock status with current achievements
            return ACHIEVEMENTS.map(achievement => ({
                ...achievement,
                unlocked: parsed.find((a: Achievement) => a.id === achievement.id)?.unlocked || false,
                unlockedAt: parsed.find((a: Achievement) => a.id === achievement.id)?.unlockedAt
            }));
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
    }
    return ACHIEVEMENTS;
};

export const saveAchievements = async (achievements: Achievement[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    } catch (error) {
        console.error('Error saving achievements:', error);
    }
};

export const checkAchievements = async (stats: Stats): Promise<Achievement[]> => {
    const achievements = await loadAchievements();
    let hasNewAchievements = false;

    const updatedAchievements = achievements.map(achievement => {
        if (!achievement.unlocked && achievement.requirement(stats)) {
            hasNewAchievements = true;
            return {
                ...achievement,
                unlocked: true,
                unlockedAt: new Date().toISOString()
            };
        }
        return achievement;
    });

    if (hasNewAchievements) {
        await saveAchievements(updatedAchievements);
    }

    return updatedAchievements;
};

export const getProgress = (achievement: Achievement, stats: Stats): number => {
    if (achievement.unlocked) return 100;
    if (achievement.progress) return achievement.progress(stats);
    return 0;
}; 