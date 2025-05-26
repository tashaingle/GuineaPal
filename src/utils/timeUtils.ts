export const TIME_PERIODS = {
    MORNING: { start: 6, end: 12 },
    AFTERNOON: { start: 12, end: 18 },
    EVENING: { start: 18, end: 22 },
    NIGHT: { start: 22, end: 6 }
} as const;

export type TimePeriod = keyof typeof TIME_PERIODS;

export const getCurrentTimePeriod = (): TimePeriod => {
    const hour = new Date().getHours();
    
    if (hour >= TIME_PERIODS.MORNING.start && hour < TIME_PERIODS.MORNING.end) {
        return 'MORNING';
    } else if (hour >= TIME_PERIODS.AFTERNOON.start && hour < TIME_PERIODS.AFTERNOON.end) {
        return 'AFTERNOON';
    } else if (hour >= TIME_PERIODS.EVENING.start && hour < TIME_PERIODS.EVENING.end) {
        return 'EVENING';
    } else {
        return 'NIGHT';
    }
};

export const isWeekend = (): boolean => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
};

export const getNextFeedingTime = (currentFeedings: string[]): Date => {
    const now = new Date();
    const feedingTimes = currentFeedings.map(time => {
        const [hours = 0, minutes = 0] = time.split(':').map(Number);
        const feedingTime = new Date();
        feedingTime.setHours(hours, minutes, 0, 0);
        if (feedingTime < now) {
            feedingTime.setDate(feedingTime.getDate() + 1);
        }
        return feedingTime;
    });
    
    return new Date(Math.min(...feedingTimes.map(d => d.getTime())));
};

export const getSpecialEvents = (): { name: string; date: Date }[] => {
    const today = new Date();
    const events = [];
    
    // Add holidays and special events
    const christmas = new Date(today.getFullYear(), 11, 25);
    if (christmas > today) {
        events.push({ name: 'Christmas', date: christmas });
    }
    
    const halloween = new Date(today.getFullYear(), 9, 31);
    if (halloween > today) {
        events.push({ name: 'Halloween', date: halloween });
    }
    
    const newYear = new Date(today.getFullYear(), 0, 1);
    if (newYear > today) {
        events.push({ name: 'New Year', date: newYear });
    }
    
    // Add seasonal events
    const seasons = [
        { name: 'Spring', month: 2, day: 20 },
        { name: 'Summer', month: 5, day: 21 },
        { name: 'Fall', month: 8, day: 22 },
        { name: 'Winter', month: 11, day: 21 }
    ];
    
    seasons.forEach(season => {
        const date = new Date(today.getFullYear(), season.month, season.day);
        if (date > today) {
            events.push({ name: `${season.name} Festival`, date });
        }
    });
    
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const formatTimeUntil = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
        return `${days}d ${hours}h`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}; 