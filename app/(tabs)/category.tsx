import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../../server/categoriesApi';
import { useGetTransactionsQuery } from '../../server/transactionsApi';
import { Category, Transaction } from '../../server/types';



const SYSTEM_NAME_OPTIONS = [
  { label: 'None (Completely Custom)', value: null }, 
  { label: 'Salary', value: 'Salary' },
  { label: 'Food', value: 'Food' },
  { label: 'Rent/Housing', value: 'Rent/Housing' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Utilities', value: 'Utilities' },
  { label: 'Entertainment', value: 'Entertainment' },
  { label: 'Miscellaneous', value: 'Miscellaneous' },
];


function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError & { data?: any } {
  return typeof error === 'object' && error !== null && 'status' in error;
}


export default function CategoryScreen() {
  const { data: categories, isLoading, refetch } = useGetCategoriesQuery();
  const { data: transactions } = useGetTransactionsQuery({});
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSystemNamePickerVisible, setIsSystemNamePickerVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySystemName, setNewCategorySystemName] = useState(null as string | null);

  // Calculate spending by category (existing logic)
  const categorySpending = React.useMemo(() => {
    // ... existing spending calculation logic ...
    if (!transactions || !categories) return {};

    const spending: Record<number, number> = {};
    categories.forEach((cat: Category) => {
      spending[cat.id] = 0;
    });

    transactions.forEach((transaction: Transaction) => {
      if (transaction.transaction_type === 'EXPENSE') {
        spending[transaction.category_id] = (spending[transaction.category_id] || 0) + parseFloat(transaction.amount);
      }
    });

    return spending;
  }, [transactions, categories]);

  const getCategoryColor = (systemName: string) => {
    // ... existing color logic ...
    const colors: Record<string, string> = {
      food: '#F59E0B',
      transport: '#3B82F6',
      entertainment: '#8B5CF6',
      shopping: '#EF4444',
      bills: '#6B7280',
      health: '#F97316',
      education: '#06B6D4',
      income: '#10B981',
      other: '#9CA3AF',
      'Rent/Housing': '#EF4444', // Added System Name from enum
      Utilities: '#8B5CF6',
      Salary: '#10B981',
      Miscellaneous: '#64748B',
    };
    return colors[systemName] || '#9CA3AF';
  };

  const renderCategory = ({ item }: { item: Category }) => {
    const spending = categorySpending[item.id] || 0;
    // Use item.name if system_name is null for color logic fallback
    const color = getCategoryColor(item.system_name || item.name.toLowerCase()); 

    return (
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeader}>
          <View style={[styles.categoryIcon, { backgroundColor: color }]}>
            <Text style={styles.iconText}>{item.name[0].toUpperCase()}</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item.name}</Text>
            {/* Display mapped system name or label if none */}
            <Text style={styles.categorySystemName}>
                Mapped: {item.system_name || 'Unmapped'}
            </Text>
          </View>
          <View style={styles.categoryStats}>
            <Text style={styles.spendingAmount}>KES {spending.toFixed(2)}</Text>
            <Text style={styles.spendingLabel}>Spent</Text>
          </View>
        </View>
        {item.is_custom && (
          <View style={[styles.customBadge, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.customBadgeText}>Custom</Text>
          </View>
        )}
      </View>
    );
  };

  const handleSelectSystemName = (value: string | null) => {
    setNewCategorySystemName(value);
    setIsSystemNamePickerVisible(false);
  }

  const handleCreateCategory = async () => {
    // Only category name is strictly required
    if (!newCategoryName.trim()) {
      Alert.alert('Error', 'Please enter a Category Name.');
      return;
    }

    try {
      await createCategory({
        name: newCategoryName.trim(),
        // Send null if 'None' is selected (which is the default or first option)
        system_name: newCategorySystemName || '',
      }).unwrap();

      setNewCategoryName('');
      setNewCategorySystemName(null); // Reset to null for next entry
      setIsModalVisible(false);
      refetch(); // Refresh list after successful creation
      Alert.alert('Success', 'Category created successfully!');
    } catch (error: unknown) {
        let errorMessage = 'Failed to create category. Please check your inputs.';
          
        if (isFetchBaseQueryError(error)) {
          if (error.status === 400 && error.data?.detail) {
            errorMessage = error.data.detail;
          } else if (Array.isArray(error.data?.detail)) {
            errorMessage = `Validation Error: ${error.data.detail[0].msg}`;
          }
        }
      
        Alert.alert('Creation Failed', errorMessage);
      }

  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: '#3B82F6' }]} 
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

      {/* Add Category Main Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Category</Text>

            <Text style={styles.inputLabel}>Category Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Weekly Groceries"
              placeholderTextColor="#94A3B8"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={styles.inputLabel}>Map to System Name (Optional)</Text>
            <TouchableOpacity 
              style={styles.textInput} 
              onPress={() => setIsSystemNamePickerVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={{color: newCategorySystemName ? '#F8FAFC' : '#94A3B8'}}>
                {SYSTEM_NAME_OPTIONS.find(opt => opt.value === newCategorySystemName)?.label || 'None (Completely Custom)'}
              </Text>
            </TouchableOpacity>

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
                disabled={isCreating || !newCategoryName.trim()} // Disable if name is empty
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? 'Creating...' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* System Name Selection Modal (Dropdown replacement) */}
      <Modal
        visible={isSystemNamePickerVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsSystemNamePickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.pickerModalContent]}>
            <Text style={styles.modalTitle}>Select System Mapping</Text>
            <FlatList
              data={SYSTEM_NAME_OPTIONS}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.pickerOption, 
                    item.value === newCategorySystemName && styles.pickerOptionSelected
                  ]}
                  onPress={() => handleSelectSystemName(item.value)}
                >
                  <Text style={styles.pickerOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... existing styles (container, header, title, addButton, loadingContainer, list, categoryCard, etc.) ...
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 20,
    fontWeight: '800',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  categorySystemName: {
    fontSize: 12,
    color: '#64748B',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  categoryStats: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  spendingAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10B981',
  },
  spendingLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  customBadge: {
    position: 'absolute',
    top: 12,
    left: 70,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  // --- Modal Styles ---
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
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#0F172A',
    color: '#F8FAFC',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#10B981',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // --- Picker Modal Styles ---
  pickerModalContent: {
    padding: 10,
    maxHeight: '80%', // Limit height for scrollability
  },
  pickerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  pickerOptionSelected: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  pickerOptionText: {
    color: '#F8FAFC',
    fontSize: 16,
  }
});