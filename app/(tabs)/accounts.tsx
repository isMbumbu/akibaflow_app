import React, { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCreateAccountMutation, useGetAccountsQuery } from '../../server/accountsApi';

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

  const renderAccount = ({ item }: { item: any }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.accountIcon}>
          <Text style={styles.iconText}>🏦</Text>
        </View>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{item.name}</Text>
          <Text style={styles.accountType}>{item.type}</Text>
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
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Account Modal */}
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

            <Text style={styles.inputLabel}>Initial Balance</Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF2FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    backgroundColor: '#2F80ED',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  accountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAF2FF',
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
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  accountType: {
    fontSize: 14,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  accountBalance: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  accountMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
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
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#2F80ED',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});