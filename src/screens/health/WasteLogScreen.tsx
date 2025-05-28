import { GuineaPig, RootStackParamList, WasteLog } from '@/navigation/types';
import { loadPets } from '@/utils/storage';
import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { Card, FAB, Portal, Provider } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'WasteLog'>;

const WASTE_EMOJIS = {
    poop: '💩',
    pee: '💧',
};

const WasteLogScreen = ({ navigation, route }: Props) => {
    const [logs, setLogs] = useState<WasteLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<WasteLog[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [pet, setPet] = useState<GuineaPig | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    useEffect(() => {
        if (selectedDate) {
            const filtered = logs.filter(log => {
                const logDate = new Date(log.date).toISOString().split('T')[0];
                return logDate === selectedDate;
            });
            setFilteredLogs(filtered);
        } else {
            setFilteredLogs(logs);
        }
    }, [selectedDate, logs]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const pets = await loadPets();
            const currentPet = pets.find(p => p.id === route.params.petId);
            if (!currentPet) {
                console.error('Pet not found with ID:', route.params.petId);
                Alert.alert('Error', 'Pet not found');
                navigation.goBack();
                return;
            }
            setPet(currentPet);
            setLogs(currentPet.wasteLogs || []);
            setFilteredLogs(currentPet.wasteLogs || []);
        } catch (error) {
            console.error('Failed to load waste logs:', error);
            Alert.alert('Error', 'Failed to load waste logs');
        } finally {
            setIsLoading(false);
        }
    };

    const getMarkedDates = () => {
        const markedDates: { 
            [key: string]: { 
                marked: boolean; 
                dotColor: string;
                selected?: boolean;
                selectedColor?: string;
            } 
        } = {};
        
        logs.forEach(log => {
            const date = new Date(log.date).toISOString().split('T')[0];
            if (date) {
                markedDates[date] = {
                    marked: true,
                    dotColor: log.type === 'poop' ? '#795548' : '#64B5F6'
                };
            }
        });
        
        if (selectedDate) {
            markedDates[selectedDate] = {
                ...(markedDates[selectedDate] || { marked: true, dotColor: '#5D4037' }),
                selected: true,
                selectedColor: '#5D4037'
            };
        }
        
        return markedDates;
    };

    const handleDateSelect = (date: DateData) => {
        setSelectedDate(date.dateString === selectedDate ? null : date.dateString);
    };

    const formatLogDetails = (log: WasteLog) => {
        const details = [];

        if (log.type === 'poop') {
            details.push(`Consistency: ${log.poopConsistency?.replace('_', ' ')}`);
            details.push(`Color: ${log.poopColor?.replace('_', ' ')}`);
        } else {
            details.push(`Color: ${log.peeColor?.replace('_', ' ')}`);
            details.push(`Volume: ${log.peeVolume}`);
        }

        const frequencyLabel = log.frequencyType === 'per_hour' ? 'per hour' : 'per day';
        details.push(`Frequency: ${log.frequency} time${log.frequency > 1 ? 's' : ''} ${frequencyLabel}`);
        if (log.location) details.push(`Location: ${log.location}`);

        return details;
    };

    const renderLog = ({ item }: { item: WasteLog }) => (
        <Card style={styles.logCard}>
            <Card.Content>
                <View style={styles.logHeader}>
                    <View style={styles.logType}>
                        <Text style={styles.logEmoji}>
                            {WASTE_EMOJIS[item.type]}
                        </Text>
                        <Text style={styles.logTitle}>
                            {item.type === 'poop' ? 'Poop' : 'Pee'} Log
                        </Text>
                    </View>
                    <Text style={styles.logDate}>
                        {new Date(item.date).toLocaleDateString()}
                        {' '}
                        {new Date(item.date).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        })}
                    </Text>
                </View>

                <View style={styles.detailsContainer}>
                    {formatLogDetails(item).map((detail, index) => (
                        <Text key={index} style={styles.detailText}>
                            • {detail}
                        </Text>
                    ))}
                </View>

                {item.notes && (
                    <Text style={styles.notes} numberOfLines={2}>
                        {item.notes}
                    </Text>
                )}
            </Card.Content>
        </Card>
    );

    const addNewLog = () => {
        navigation.navigate('AddWasteLog', {
            petId: route.params.petId,
            onSave: loadData,
        });
    };

    return (
        <Provider>
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#5D4037" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        Waste Log
                    </Text>
                </View>

                <FlatList
                    data={filteredLogs}
                    renderItem={renderLog}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    ListHeaderComponent={
                        <>
                            <View style={styles.banner}>
                                <Text style={styles.bannerTitle}>{pet?.name}'s Waste Log</Text>
                                <Text style={styles.bannerSubtitle}>Track and monitor your pet's waste patterns</Text>
                            </View>
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    markedDates={getMarkedDates()}
                                    onDayPress={handleDateSelect}
                                    theme={{
                                        calendarBackground: '#FFFFFF',
                                        textSectionTitleColor: '#5D4037',
                                        selectedDayBackgroundColor: '#5D4037',
                                        selectedDayTextColor: '#FFFFFF',
                                        todayTextColor: '#5D4037',
                                        dayTextColor: '#795548',
                                        textDisabledColor: '#D7CCC8',
                                        dotColor: '#5D4037',
                                        monthTextColor: '#5D4037',
                                        arrowColor: '#5D4037',
                                    }}
                                />
                            </View>
                            {selectedDate && filteredLogs.length === 0 && (
                                <View style={styles.noLogsMessage}>
                                    <Text style={styles.noLogsText}>No logs for {new Date(selectedDate).toLocaleDateString()}</Text>
                                </View>
                            )}
                        </>
                    }
                    ListEmptyComponent={
                        !selectedDate ? (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="event-note" size={48} color="#BDBDBD" />
                                <Text style={styles.emptyText}>No waste logs yet</Text>
                                <Text style={styles.emptySubtext}>
                                    Start tracking your pet's waste to monitor their health
                                </Text>
                            </View>
                        ) : null
                    }
                />

                <Portal>
                    <FAB
                        icon="plus"
                        label="Add Log"
                        style={[styles.fab, { bottom: insets.bottom + 16 }]}
                        onPress={addNewLog}
                        color="white"
                    />
                </Portal>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#FFF8E1',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        flex: 1,
        fontSize: 22,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    listContent: {
        padding: 16,
    },
    logCard: {
        marginBottom: 16,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    logType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    logTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
    },
    logDate: {
        fontSize: 14,
        color: '#757575',
    },
    detailsContainer: {
        marginBottom: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#795548',
        marginBottom: 4,
    },
    notes: {
        fontSize: 14,
        color: '#757575',
        fontStyle: 'italic',
        marginTop: 8,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#5D4037',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#795548',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 16,
        backgroundColor: '#5D4037',
    },
    banner: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 4,
    },
    bannerSubtitle: {
        fontSize: 16,
        color: '#795548',
    },
    calendarContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        marginBottom: 16,
        padding: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    noLogsMessage: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    noLogsText: {
        color: '#795548',
        fontSize: 16,
    },
});

export default WasteLogScreen; 