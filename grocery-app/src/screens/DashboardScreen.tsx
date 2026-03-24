import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { theme } from '../theme';
import { useShoppingLists } from '../hooks/useShoppingLists';
import { CreateListModal } from '../components/CreateListModal';
import { ListDetailModal } from '../components/ListDetailModal';
import { ShoppingListCard } from '../components/ShoppingListCard';
import { SmartSuggestions } from '../components/SmartSuggestions';

export default function DashboardScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { scannedItem?: any } }>>();
  const { lists, setActiveList, getSuggestedItems, addItem, deleteList } = useShoppingLists();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Handle scanned item return
  React.useEffect(() => {
    if (route.params?.scannedItem) {
      const item = route.params.scannedItem;
      // Clear params to avoid loop/re-trigger
      navigation.setParams({ scannedItem: undefined });

      // Use the logic from SmartSuggestions to add the item
      // We can reuse handleAddSuggestion logic but maybe we need to open the suggestion modal?
      // For now, let's just trigger the add flow if we have lists.
      if (lists.length === 1) {
        addItem(lists[0].id, {
          name: item.name,
          category: item.category || 'Other',
          unit: 'pcs',
          quantity: 1,
          notes: item.notes
        });
        alert(`Added "${item.name}" to ${lists[0].name}`);
      } else if (lists.length > 0) {
        Alert.alert(
          'Scanned Item',
          `Add "${item.name}" to which list?`,
          [
            ...lists.map(list => ({
              text: list.name,
              onPress: () => {
                addItem(list.id, {
                  name: item.name,
                  category: item.category || 'Other',
                  unit: 'pcs',
                  quantity: 1,
                  notes: item.notes
                });
              }
            })),
            { text: 'Cancel', style: 'cancel' as const, onPress: () => { } }
          ]
        );
      } else {
        alert('Please create a shopping list first.');
      }
    }
  }, [route.params?.scannedItem]);

  const suggestions = getSuggestedItems(6);

  const handleAddSuggestion = (item: any, listId: string) => {
    addItem(listId, {
      name: item.name,
      category: item.category,
      unit: item.unit,
      quantity: item.avgQuantity,
      price: item.avgPrice,
    });
  };

  const recentLists = lists.slice(0, 3);
  const totalLists = lists.length;
  const totalItems = lists.reduce((sum, list) => sum + list.totalItems, 0);
  const totalSpent = lists.reduce((sum, list) => sum + list.totalPrice, 0);

  const handleNewList = () => {
    setShowCreateModal(true);
  };

  const handleListCreated = (listId: string) => {
    setActiveList(listId);
    setSelectedListId(listId);
  };

  const handleListPress = (listId: string) => {
    setActiveList(listId);
    setSelectedListId(listId);
  };

  const handleListDelete = (list: any) => {
    deleteList(list.id);
  };

  const QuickActionCard = ({
    icon,
    title,
    gradient,
    onPress,
  }: {
    icon: string;
    title: string;
    gradient: readonly string[];
    onPress?: () => void;
  }) => (
    <TouchableOpacity style={styles.quickAction} activeOpacity={0.8} onPress={onPress}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.quickActionGradient}
      >
        <MaterialIcons name={icon as any} size={28} color="#fff" />
        <Text style={styles.quickActionText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const StatCard = ({
    icon,
    value,
    label,
    color,
  }: {
    icon: string;
    value: string;
    label: string;
    color: string;
  }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <MaterialIcons name={icon as any} size={24} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={theme.colors.primary.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello! 👋</Text>
              <Text style={styles.headerTitle}>Ready to shop?</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <MaterialIcons name="notifications-none" size={28} color="#fff" />
              {lists.length > 0 && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <QuickActionCard
                icon="add-shopping-cart"
                title="New List"
                gradient={['#10B981', '#065F46'] as const}
                onPress={handleNewList}
              />
              <QuickActionCard
                icon="qr-code-scanner"
                title="Scan Item"
                gradient={['#8B5CF6', '#5B21B6'] as const}
                onPress={() => navigation.navigate('ScanItem' as never)}
              />
              <QuickActionCard
                icon="restaurant-menu"
                title="Recipes"
                gradient={['#F59E0B', '#B45309'] as const}
              />
            </View>
          </View>

          {/* Smart Suggestions */}
          <SmartSuggestions
            suggestions={suggestions}
            onAddToList={handleAddSuggestion}
          />

          {/* Stats Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <StatCard
                icon="shopping-cart"
                value={totalLists.toString()}
                label="Shopping Lists"
                color={theme.colors.primary.main}
              />
              <StatCard
                icon="inventory"
                value={totalItems.toString()}
                label="Total Items"
                color={theme.colors.accent.orange}
              />
              <StatCard
                icon="attach-money"
                value={`$${totalSpent.toFixed(0)}`}
                label="Total Value"
                color={theme.colors.accent.purple}
              />
            </View>
          </View>

          {/* Recent Lists */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Lists</Text>
              {lists.length > 3 && (
                <TouchableOpacity onPress={() => navigation.navigate('Cart' as never)}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentLists.length > 0 ? (
              <View>
                {recentLists.map((list) => (
                  <ShoppingListCard
                    key={list.id}
                    list={list}
                    onPress={() => handleListPress(list.id)}
                    onDelete={() => handleListDelete(list)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyRecentLists}>
                <MaterialIcons name="inbox" size={48} color={theme.colors.text.tertiary} />
                <Text style={styles.emptyRecentText}>No shopping lists yet</Text>
                <Text style={styles.emptyRecentSubtext}>
                  Tap "New List" to create your first list
                </Text>
              </View>
            )}
          </View>

          {/* Tips Card */}
          <View style={styles.section}>
            <LinearGradient
              colors={['#EEF2FF', '#E0E7FF'] as const}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipCard}
            >
              <View style={styles.tipIconContainer}>
                <MaterialIcons name="lightbulb" size={24} color={theme.colors.accent.orange} />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Pro Tip</Text>
                <Text style={styles.tipText}>
                  Organize items by category to save time while shopping!
                </Text>
              </View>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>

      <CreateListModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleListCreated}
      />

      <ListDetailModal
        visible={selectedListId !== null}
        listId={selectedListId}
        onClose={() => setSelectedListId(null)}
      />
    </>
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.status.error,
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary.main,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  quickActionGradient: {
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    marginTop: theme.spacing.sm,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  emptyRecentLists: {
    backgroundColor: theme.colors.background.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  emptyRecentText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  emptyRecentSubtext: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    marginTop: 4,
    textAlign: 'center',
  },
  tipCard: {
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    flexDirection: 'row',
    ...theme.shadows.sm,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
});
