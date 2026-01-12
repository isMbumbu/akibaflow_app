import React, { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateAccountMutation, useGetAccountsQuery } from '../../server/accountsApi';
import { Account } from '../../server/types';
export default function AccountsScreen() {
  const { data: accounts, isLoading, refetch } = useGetAccountsQuery();
  const [createAccount, { isLoading: isCreating }] = useCreateAccountMutation();

  const [modalVisible, setModalVisible] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  const handleCreateAccount = async () => {
    if (!accountName.trim() || !initialBalance.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await createAccount({
        name: accountName.trim(),
        initial_balance: parseFloat(initialBalance),
        currency: 'KES',
        type: 'checking',
      }).unwrap();

      Alert.alert('Success', 'Account created successfully');
      setModalVisible(false);
      setAccountName('');
      setInitialBalance('');
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          {/* Using a more stylized icon text */}
          <Text style={styles.iconText}>{item.type === 'checking' ? '💳' : '💰'}</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <Text style={styles.accountType}>{item.type.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.accountBalance}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balanceAmount}>KES {parseFloat(item.current_balance || '0').toFixed(2)}</Text>
      </View>

      <View style={styles.accountMeta}>
        <Text style={styles.metaText}>Initial: KES {parseFloat(item.initial_balance || '0').toFixed(2)}</Text>
        <Text style={styles.metaText}>{item.currency}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ScrollView added to ensure content, especially header, is visible in dark mode */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Accounts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Account</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading accounts...</Text>
          </View>
        ) : accounts && accounts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No accounts yet</Text>
            <Text style={styles.emptySubtext}>Add your first account to get started</Text>
          </View>
        ) : (
          <FlatList
            data={accounts}
            renderItem={renderAccount}
            keyExtractor={(item) => item.id.toString()}
            style={styles.list}
            scrollEnabled={false} // Disable FlatList scrolling when it's inside a ScrollView
          />
        )}
      </ScrollView>

      {/* Add Account Modal (Styles updated for dark theme) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Account</Text>

            <Text style={styles.inputLabel}>Account Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Main Checking"
              value={accountName}
              onChangeText={setAccountName}
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Initial Balance (KES)</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              value={initialBalance}
              onChangeText={setInitialBalance}
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateAccount}
                disabled={isCreating}
              >
                <Text style={styles.createButtonText}>
                  {isCreating ? 'Creating...' : 'Create Account'}
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
  // --- Global Container Styles (Matches Transactions) ---
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark background
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60, // Adjusted padding for the title/header
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC', // Light text
  },
  addButton: {
    backgroundColor: '#3B82F6', // Blue primary color
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  list: {
    flex: 1,
  },

  // --- Account Card Styles (Matches Transaction Card) ---
  accountCard: {
    backgroundColor: '#1E293B', // Dark card background
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#334155', // Subtle border
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155', // Darker background for icon
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC', // Light text
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#94A3B8', // Grayed out text
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  accountBalance: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#64748B', // Muted text
    marginBottom: 4,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#10B981', // Green for positive/current balance focus
  },
  accountMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B', // Muted text
    fontWeight: '500',
  },

  // --- Loading/Empty State Styles (Matches Transactions) ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200, // Ensure loading view is visible
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // --- Modal Styles (Updated for Dark Theme) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B', // Dark modal content
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
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
  input: {
    backgroundColor: '#0F172A', // Even darker input background
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#F8FAFC',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155', // Darker cancel button
  },
  cancelButtonText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  createButton: {
    backgroundColor: '#3B82F6', // Primary color
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});