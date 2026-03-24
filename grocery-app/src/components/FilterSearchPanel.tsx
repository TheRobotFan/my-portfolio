import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { SortOption } from '../types';

interface FilterSearchPanelProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    priceRange: { min: string; max: string };
    onPriceRangeChange: (range: { min: string; max: string }) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    showChecked: boolean;
    onShowCheckedToggle: () => void;
    onClearFilters: () => void;
    activeFilterCount: number;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
    { value: 'name', label: 'Name', icon: 'sort-by-alpha' },
    { value: 'category', label: 'Category', icon: 'category' },
    { value: 'price', label: 'Price', icon: 'attach-money' },
    { value: 'dateAdded', label: 'Date', icon: 'schedule' },
];

export const FilterSearchPanel: React.FC<FilterSearchPanelProps> = ({
    searchQuery,
    onSearchChange,
    categories,
    selectedCategories,
    onCategoryToggle,
    priceRange,
    onPriceRangeChange,
    sortBy,
    onSortChange,
    showChecked,
    onShowCheckedToggle,
    onClearFilters,
    activeFilterCount,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <MaterialIcons name="search" size={20} color={theme.colors.text.tertiary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items..."
                    placeholderTextColor={theme.colors.text.tertiary}
                    value={searchQuery}
                    onChangeText={onSearchChange}
                />
                {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => onSearchChange('')}>
                        <MaterialIcons name="close" size={20} color={theme.colors.text.tertiary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filter Toggle Button */}
            <View style={styles.filterHeader}>
                <TouchableOpacity
                    style={styles.filterToggle}
                    onPress={() => setIsExpanded(!isExpanded)}
                >
                    <MaterialIcons
                        name={isExpanded ? 'expand-less' : 'expand-more'}
                        size={20}
                        color={theme.colors.primary.main}
                    />
                    <Text style={styles.filterToggleText}>Filters & Sort</Text>
                    {activeFilterCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{activeFilterCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {activeFilterCount > 0 && (
                    <TouchableOpacity onPress={onClearFilters} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Expanded Filters */}
            {isExpanded && (
                <View style={styles.filtersContent}>
                    {/* Sort Options */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Sort By</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.sortOptions}>
                                {SORT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.sortChip,
                                            sortBy === option.value && styles.sortChipActive,
                                        ]}
                                        onPress={() => onSortChange(option.value)}
                                    >
                                        <MaterialIcons
                                            name={option.icon as any}
                                            size={16}
                                            color={
                                                sortBy === option.value
                                                    ? '#fff'
                                                    : theme.colors.text.secondary
                                            }
                                        />
                                        <Text
                                            style={[
                                                styles.sortChipText,
                                                sortBy === option.value && styles.sortChipTextActive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Show/Hide Checked */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={styles.checkboxRow}
                            onPress={onShowCheckedToggle}
                        >
                            <MaterialIcons
                                name={showChecked ? 'check-box' : 'check-box-outline-blank'}
                                size={24}
                                color={theme.colors.primary.main}
                            />
                            <Text style={styles.checkboxLabel}>Show checked items</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Categories */}
                    {categories.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Categories</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.categoryChips}>
                                    {categories.map((category) => (
                                        <TouchableOpacity
                                            key={category}
                                            style={[
                                                styles.categoryChip,
                                                selectedCategories.includes(category) &&
                                                styles.categoryChipActive,
                                            ]}
                                            onPress={() => onCategoryToggle(category)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryChipText,
                                                    selectedCategories.includes(category) &&
                                                    styles.categoryChipTextActive,
                                                ]}
                                            >
                                                {category}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Price Range */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Price Range</Text>
                        <View style={styles.priceInputs}>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceLabel}>Min</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="0"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    keyboardType="decimal-pad"
                                    value={priceRange.min}
                                    onChangeText={(text) =>
                                        onPriceRangeChange({ ...priceRange, min: text })
                                    }
                                />
                            </View>
                            <Text style={styles.priceSeparator}>-</Text>
                            <View style={styles.priceInputContainer}>
                                <Text style={styles.priceLabel}>Max</Text>
                                <TextInput
                                    style={styles.priceInput}
                                    placeholder="∞"
                                    placeholderTextColor={theme.colors.text.tertiary}
                                    keyboardType="decimal-pad"
                                    value={priceRange.max}
                                    onChangeText={(text) =>
                                        onPriceRangeChange({ ...priceRange, max: text })
                                    }
                                />
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.background.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border.light,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        margin: theme.spacing.md,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
    },
    filterToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterToggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary.main,
    },
    badge: {
        backgroundColor: theme.colors.primary.main,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    clearButton: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    filtersContent: {
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    section: {
        gap: theme.spacing.sm,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sortOptions: {
        flexDirection: 'row',
        gap: 8,
    },
    sortChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: theme.colors.background.secondary,
    },
    sortChipActive: {
        backgroundColor: theme.colors.primary.main,
    },
    sortChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    sortChipTextActive: {
        color: '#fff',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    checkboxLabel: {
        fontSize: 14,
        color: theme.colors.text.primary,
    },
    categoryChips: {
        flexDirection: 'row',
        gap: 8,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: theme.colors.background.secondary,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryChipActive: {
        backgroundColor: theme.colors.primary.main,
        borderColor: theme.colors.primary.main,
    },
    categoryChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    categoryChipTextActive: {
        color: '#fff',
    },
    priceInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    priceInputContainer: {
        flex: 1,
        gap: 4,
    },
    priceLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
    },
    priceInput: {
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    priceSeparator: {
        fontSize: 18,
        color: theme.colors.text.tertiary,
        marginTop: 20,
    },
});
