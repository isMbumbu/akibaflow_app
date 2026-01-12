import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../../server/categoriesApi';
import { useGetTransactionsQuery } from '../../server/transactionsApi';

export default function CategoryScreen() {
  const { data: categories, isLoading } = useGetCategoriesQuery();
  const { data: transactions } = useGetTransactionsQuery({});
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySystemName, setNewCategorySystemName] = useState('');

  // Calculate spending by category
  const categorySpending = React.useMemo(() => {
    if (!transactions || !categories) return {};

    const spending: Record<number, number> = {};
    categories.forEach(cat => {
      spending[cat.id] = 0;
    });

    transactions.forEach(transaction => {
      if (transaction.transaction_type === 'EXPENSE') {
        spending[transaction.category_id] = (spending[transaction.category_id] || 0) + parseFloat(transaction.amount);
      }
    });

    return spending;
  }, [transactions, categories]);

  const getCategoryColor = (systemName: string) => {
    const colors: Record<string, string> = {
      food: '#F59E0B',
      transport: '#2F80ED',
      entertainment: '#10B981',
      shopping: '#EF4444',
      bills: '#8B5CF6',
      health: '#F97316',
      education: '#06B6D4',
      other: '#6B7280',
    };
    return colors[systemName] || '#6B7280';
  };

  const renderCategory = ({ item }: { item: any }) => {
    const spending = categorySpending[item.id] || 0;
    const color = getCategoryColor(item.system_name);

    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: color }]}>
            <Text style={styles.iconText}>{item.name[0].toUpperCase()}</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <Text style={styles.categorySystemName}>{item.system_name}</Text>
          </View>
          <View style={styles.categoryStats}>
            <Text style={styles.spendingAmount}>KES {spending.toFixed(2)}</Text>
            <Text style={styles.spendingLabel}>Spent</Text>
          </View>
        </View>
        {item.is_custom && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>Custom</Text>
          </View>
        )}
      </View>
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !newCategorySystemName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await createCategory({
        name: newCategoryName.trim(),
        system_name: newCategorySystemName.trim().toLowerCase(),
      }).unwrap();

      setNewCategoryName('');
      setNewCategorySystemName('');
      setIsModalVisible(false);
      Alert.alert('Success', 'Category created successfully!');
    } catch {
      Alert.alert('Error', 'Failed to create category. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories found</Text>
            </View>
          }
        />
      )}

      {/* Add Category Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>

            <Text style={styles.inputLabel}>Category Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Groceries"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={styles.inputLabel}>System Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., food"
              value={newCategorySystemName}
              onChangeText={setNewCategorySystemName}
              autoCapitalize="none"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateCategory}
                disabled={isCreating}
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  list: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  categorySystemName: {
    fontSize: 14,
    color: '#94A3B8',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  categoryStats: {
    alignItems: 'flex-end',
  },
  spendingAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  spendingLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  customBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  customBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    width: '90%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
    marginTop: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 28,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
