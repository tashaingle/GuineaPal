import colors from '@/theme/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    title: string;
    scrollable?: boolean;
    rightIcon?: keyof typeof MaterialIcons.glyphMap;
    onRightPress?: () => void;
    showBack?: boolean;
}

const BaseScreen: React.FC<Props> = ({
    children,
    title,
    scrollable = true,
    rightIcon,
    onRightPress,
    showBack = true
}) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                )}
                <Text style={[styles.title, showBack && styles.titleWithBack]}>
                    {title}
                </Text>
                {rightIcon && onRightPress && (
                    <TouchableOpacity
                        onPress={onRightPress}
                        style={styles.rightIcon}
                    >
                        <MaterialIcons name={rightIcon} size={24} color={colors.text.primary} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={[styles.content, !scrollable && styles.nonScrollableContent]}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.DEFAULT
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 64
    },
    backButton: {
        position: 'absolute',
        left: 16,
        zIndex: 1,
        padding: 8
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text.primary,
        flex: 1,
        textAlign: 'center'
    },
    titleWithBack: {
        marginLeft: 40 // Make space for back button
    },
    content: {
        flex: 1
    },
    nonScrollableContent: {
        overflow: 'hidden'
    },
    rightIcon: {
        padding: 8,
        marginRight: -8
    }
});

export default BaseScreen; 