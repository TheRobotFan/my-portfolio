import { Platform } from 'react-native';

export const theme = {
    colors: {
        primary: {
            light: '#10B981',
            main: '#059669',
            dark: '#064E3B',
            gradient: ['#10B981', '#059669'] as const,
        },
        secondary: {
            main: '#6366F1',
            light: '#818CF8',
            gradient: ['#6366F1', '#4F46E5'] as const,
        },
        accent: {
            purple: '#8B5CF6',
            orange: '#F59E0B',
            blue: '#3B82F6',
            pink: '#EC4899',
        },
        status: {
            success: '#10B981',
            warning: '#F59E0B',
            error: '#EF4444',
            info: '#3B82F6',
        },
        background: {
            primary: '#F9FAFB',
            secondary: '#F3F4F6',
            white: '#FFFFFF',
            dark: '#030712',
        },
        text: {
            primary: '#111827',
            secondary: '#4B5563',
            tertiary: '#9CA3AF',
            white: '#FFFFFF',
        },
        border: {
            light: '#F3F4F6',
            main: '#E5E7EB',
            dark: '#D1D5DB',
        },
    },

    typography: {
        h1: {
            fontSize: 32,
            fontWeight: '700' as const,
            lineHeight: 40,
        },
        h2: {
            fontSize: 24,
            fontWeight: '700' as const,
            lineHeight: 32,
        },
        h3: {
            fontSize: 20,
            fontWeight: '600' as const,
            lineHeight: 28,
        },
        subtitle: {
            fontSize: 18,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
        body: {
            fontSize: 16,
            fontWeight: '400' as const,
            lineHeight: 24,
        },
        bodySmall: {
            fontSize: 14,
            fontWeight: '400' as const,
            lineHeight: 20,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            lineHeight: 16,
        },
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            lineHeight: 24,
        },
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 12,
        md: 20,
        lg: 32,
        xl: 48,
        full: 9999,
    },

    shadows: {
        sm: Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
            },
            default: {
                elevation: 2,
            },
        }),
        md: Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            },
            default: {
                elevation: 4,
            },
        }),
        lg: Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
            },
            android: {
                elevation: 8,
            },
            web: {
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            },
            default: {
                elevation: 8,
            },
        }),
        xl: Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 16,
            },
            android: {
                elevation: 12,
            },
            web: {
                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
            },
            default: {
                elevation: 12,
            },
        }),
    } as const,
};

export type Theme = typeof theme;
