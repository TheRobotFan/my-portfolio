import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export default function SettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    const SettingItem = ({
        icon,
        title,
        subtitle,
        iconColor,
        iconBg,
        onPress,
        showChevron = true,
    }: {
        icon: string;
        title: string;
        subtitle?: string;
        iconColor: string;
        iconBg: string;
        onPress?: () => void;
        showChevron?: boolean;
    }) => (
        <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
                    <MaterialIcons name={icon as any} size={24} color={iconColor} />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            {showChevron && <MaterialIcons name="chevron-right" size={24} color={theme.colors.text.tertiary} />}
        </TouchableOpacity>
    );

    const SettingToggle = ({
        icon,
        title,
        subtitle,
        iconColor,
        iconBg,
        value,
        onValueChange,
    }: {
        icon: string;
        title: string;
        subtitle?: string;
        iconColor: string;
        iconBg: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
                    <MaterialIcons name={icon as any} size={24} color={iconColor} />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: theme.colors.border.main, true: theme.colors.primary.light }}
                thumbColor={value ? theme.colors.primary.main : theme.colors.background.white}
            />
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header with Gradient */}
            <LinearGradient
                colors={theme.colors.primary.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.profileContainer}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={56} color={theme.colors.primary.main} />
                        </View>
                        <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.8}>
                            <MaterialIcons name="camera-alt" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.profileName}>Guest User</Text>
                    <Text style={styles.profileEmail}>Sign in to sync your lists across devices</Text>

                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.signInButton}>
                            <Text style={styles.signInText}>Sign In</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View style={styles.content}>
                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>ACCOUNT</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="person-outline"
                            title="Profile"
                            subtitle="Manage your account details"
                            iconColor={theme.colors.primary.main}
                            iconBg={theme.colors.primary.light + '20'}
                        />
                        <View style={styles.divider} />
                        <SettingToggle
                            icon="notifications-none"
                            title="Notifications"
                            subtitle="Push notifications and alerts"
                            iconColor={theme.colors.accent.purple}
                            iconBg={theme.colors.accent.purple + '20'}
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                        />
                    </View>
                </View>

                {/* Shopping Preferences */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SHOPPING PREFERENCES</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="store"
                            title="Favorite Stores"
                            subtitle="Manage your preferred stores"
                            iconColor={theme.colors.accent.blue}
                            iconBg={theme.colors.accent.blue + '20'}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="category"
                            title="Categories"
                            subtitle="Customize product categories"
                            iconColor={theme.colors.accent.orange}
                            iconBg={theme.colors.accent.orange + '20'}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="savings"
                            title="Budget & Savings"
                            subtitle="Set budget limits and track savings"
                            iconColor={theme.colors.primary.main}
                            iconBg={theme.colors.primary.light + '20'}
                        />
                    </View>
                </View>

                {/* App Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>APP SETTINGS</Text>
                    <View style={styles.card}>
                        <SettingToggle
                            icon="dark-mode"
                            title="Dark Mode"
                            subtitle="Switch to dark theme"
                            iconColor={theme.colors.text.primary}
                            iconBg={theme.colors.text.primary + '20'}
                            value={darkModeEnabled}
                            onValueChange={setDarkModeEnabled}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="language"
                            title="Language"
                            subtitle="English (US)"
                            iconColor={theme.colors.accent.purple}
                            iconBg={theme.colors.accent.purple + '20'}
                        />
                    </View>
                </View>

                {/* Portfolio Bridge */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>PORTFOLIO</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="arrow-back"
                            title="Back to Portfolio Hub"
                            subtitle="Return to project showcase"
                            iconColor={theme.colors.primary.main}
                            iconBg={theme.colors.primary.light + '20'}
                            onPress={() => Linking.openURL('http://localhost:3000')}
                        />
                    </View>
                </View>

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SUPPORT</Text>
                    <View style={styles.card}>
                        <SettingItem
                            icon="help-outline"
                            title="Help & FAQ"
                            subtitle="Get help and answers"
                            iconColor={theme.colors.accent.blue}
                            iconBg={theme.colors.accent.blue + '20'}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="feedback"
                            title="Send Feedback"
                            subtitle="Share your thoughts with us"
                            iconColor={theme.colors.accent.orange}
                            iconBg={theme.colors.accent.orange + '20'}
                        />
                        <View style={styles.divider} />
                        <SettingItem
                            icon="info-outline"
                            title="About"
                            subtitle="Version 1.0.0"
                            iconColor={theme.colors.text.secondary}
                            iconBg={theme.colors.text.secondary + '20'}
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ for smart shoppers</Text>
                    <Text style={styles.footerVersion}>Grocery Shopping App v1.0.0</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background.primary,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 32,
        paddingHorizontal: theme.spacing.lg,
    },
    profileContainer: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.lg,
    },
    editAvatarButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.primary.dark,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: theme.spacing.md,
    },
    signInButton: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: theme.borderRadius.full,
        ...theme.shadows.md,
    },
    signInText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary.main,
    },
    content: {
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
        marginLeft: 4,
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: theme.colors.background.white,
        borderRadius: theme.borderRadius.md,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        color: theme.colors.text.secondary,
    },
    divider: {
        height: 1,
        backgroundColor: theme.colors.border.light,
        marginLeft: 80,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    footerText: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginBottom: 4,
    },
    footerVersion: {
        fontSize: 12,
        color: theme.colors.text.tertiary,
    },
});
