import BaseScreen from '@/components/BaseScreen';
import { Stats } from '@/types';
import { Achievement, getProgress, loadAchievements } from '@/utils/achievements';
import { formatTimeAgo } from '@/utils/dateUtils';
import { loadStats } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

const AchievementCard = ({ achievement, stats }: { achievement: Achievement; stats: Stats }) => {
    const progress = getProgress(achievement, stats);

    return (
        <View style={[
            styles.achievementCard,
            achievement.unlocked && styles.unlockedCard
        ]}>
            <View style={styles.achievementHeader}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementTitleContainer}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    {achievement.unlocked && achievement.unlockedAt && (
                        <Text style={styles.unlockedTime}>
                            Unlocked {formatTimeAgo(new Date(achievement.unlockedAt))}
                        </Text>
                    )}
                </View>
            </View>
            
            <Text style={styles.achievementDescription}>
                {achievement.description}
            </Text>
            
            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progress / 100}
                    color={achievement.unlocked ? '#4CAF50' : '#FF9800'}
                    style={styles.progressBar}
                />
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>

            {achievement.reward && (
                <View style={styles.rewardContainer}>
                    <Text style={styles.rewardText}>
                        Reward: {achievement.reward.value} {achievement.reward.type}
                    </Text>
                </View>
            )}
        </View>
    );
};

const AchievementsScreen = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<Stats>({
        happiness: 0,
        hunger: 0,
        health: 0,
        energy: 0
    });

    useEffect(() => {
        const loadData = async () => {
            const [loadedAchievements, loadedStats] = await Promise.all([
                loadAchievements(),
                loadStats()
            ]);
            setAchievements(loadedAchievements);
            setStats(loadedStats);
        };

        loadData();
    }, []);

    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;

    return (
        <BaseScreen title="Achievements">
            <View style={styles.container}>
                <View style={styles.summary}>
                    <Text style={styles.summaryText}>
                        {unlockedCount} of {totalCount} Achievements Unlocked
                    </Text>
                    <ProgressBar
                        progress={unlockedCount / totalCount}
                        color="#4CAF50"
                        style={styles.overallProgress}
                    />
                </View>

                <FlatList
                    data={achievements}
                    renderItem={({ item }) => (
                        <AchievementCard
                            achievement={item}
                            stats={stats}
                        />
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                />
            </View>
        </BaseScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1'
    },
    summary: {
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 8,
        borderRadius: 8,
        margin: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#5D4037'
    },
    overallProgress: {
        height: 8,
        borderRadius: 4
    },
    listContent: {
        padding: 16,
        paddingTop: 0
    },
    achievementCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    unlockedCard: {
        backgroundColor: '#F1F8E9'
    },
    achievementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    achievementIcon: {
        fontSize: 24,
        marginRight: 12
    },
    achievementTitleContainer: {
        flex: 1
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037'
    },
    unlockedTime: {
        fontSize: 12,
        color: '#78909C',
        marginTop: 2
    },
    achievementDescription: {
        fontSize: 14,
        color: '#616161',
        marginBottom: 12
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    progressBar: {
        flex: 1,
        height: 8,
        borderRadius: 4
    },
    progressText: {
        marginLeft: 8,
        fontSize: 12,
        color: '#616161',
        width: 40,
        textAlign: 'right'
    },
    rewardContainer: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#FFF3E0',
        borderRadius: 4
    },
    rewardText: {
        fontSize: 12,
        color: '#F57C00'
    }
});

export default AchievementsScreen; 