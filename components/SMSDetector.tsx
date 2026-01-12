import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGetAccountsQuery } from '../server/accountsApi';
import { useGetCategoriesQuery } from '../server/categoriesApi';
import { useCreateTransactionMutation } from '../server/transactionsApi';

// SMS Detection Component - Note: Full SMS reading requires native modules beyond Expo's capabilities
export default function SMSDetector() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastDetected, setLastDetected] = useState<string | null>(null);

  // API hooks
  const [createTransaction, { isLoading: isCreating }] = useCreateTransactionMutation();
  const { data: accounts } = useGetAccountsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const enableSMSDetection = () => {
    setIsEnabled(true);
    Alert.alert(
      'SMS Detection Enabled',
      'Transaction detection is now active. In a production app, this would monitor SMS messages from your bank accounts.',
      [{ text: 'OK' }]
    );
  };

  // Mock transaction detection - In production, this would parse real SMS messages
  const mockDetectTransaction = async () => {
    if (!accounts || accounts.length === 0) {
      Alert.alert('No Accounts', 'Please create an account first before detecting transactions.');
      return;
    }

    if (!categories || categories.length === 0) {
      Alert.alert('No Categories', 'Please create categories first before detecting transactions.');
      return;
    }

    const mockTransactions = [
      { amount: 250.00, type: 'EXPENSE' as const, description: 'Grocery shopping at QuickMart' },
      { amount: 1500.00, type: 'INCOME' as const, description: 'Salary deposit from TechCorp' },
      { amount: 45.00, type: 'EXPENSE' as const, description: 'Uber ride to downtown' },
      { amount: 120.00, type: 'EXPENSE' as const, description: 'Electricity bill payment' },
      { amount: 300.00, type: 'INCOME' as const, description: 'Freelance payment received' },
    ];

    const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];

    // Get default account and category (first available)
    const defaultAccount = accounts[0];
    const defaultCategory = categories.find(cat => cat.system_name === 'food') ||
                           categories.find(cat => cat.system_name === 'transport') ||
                           categories[0];

    try {
      const transactionData = {
        amount: randomTransaction.amount,
        transaction_type: randomTransaction.type,
        account_id: defaultAccount.id,
        category_id: defaultCategory.id,
        description: randomTransaction.description,
        transaction_date: new Date().toISOString().split('T')[0], // Today's date
      };

      await createTransaction(transactionData).unwrap();

      setLastDetected(`${randomTransaction.type}: KES ${randomTransaction.amount} - ${randomTransaction.description}`);

      Alert.alert(
        'Transaction Added! ✅',
        `Successfully added: ${randomTransaction.description}\nAmount: KES ${randomTransaction.amount}\n\nThis transaction has been automatically added to your account.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to create transaction:', error);
      Alert.alert(
        'Detection Failed',
        'Unable to add the transaction. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SMS Transaction Detection</Text>
      <Text style={styles.description}>
        Automatically detect transactions from SMS messages from your bank accounts.
      </Text>

      {!isEnabled ? (
        <View style={styles.setupContainer}>
          <Text style={styles.setupText}>
            Enable automatic transaction detection to save time on manual entry.
          </Text>
          <TouchableOpacity style={styles.enableButton} onPress={enableSMSDetection}>
            <Text style={styles.enableButtonText}>Enable SMS Detection</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.enabledContainer}>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Active - Monitoring SMS</Text>
          </View>

          <TouchableOpacity
            style={[styles.testButton, isCreating && styles.testButtonDisabled]}
            onPress={mockDetectTransaction}
            disabled={isCreating}
          >
            <Text style={styles.testButtonText}>
              {isCreating ? 'Adding Transaction...' : 'Test Detection (Demo)'}
            </Text>
          </TouchableOpacity>

          {lastDetected && (
            <View style={styles.detectionResult}>
              <Text style={styles.resultLabel}>Last Detected:</Text>
              <Text style={styles.resultText}>{lastDetected}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How it works:</Text>
        <Text style={styles.infoText}>
          • The app monitors SMS from identified bank numbers{'\n'}
          • Transaction details are automatically extracted{'\n'}
          • Transactions are automatically added to your account{'\n'}
          • No sensitive banking information is stored locally
        </Text>
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>📱 Technical Note:</Text>
        <Text style={styles.noteText}>
          Full SMS reading requires native modules. This demo shows the concept. In production, you would need custom native code or third-party services for SMS parsing.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EAF2FF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 22,
  },
  setupContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  setupText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 22,
  },
  enableButton: {
    backgroundColor: '#2F80ED',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  enabledContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  testButton: {
    backgroundColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  testButtonDisabled: {
    backgroundColor: '#D97706',
    opacity: 0.6,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  detectionResult: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  resultLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  resultText: {
    fontSize: 14,
    color: '#1F2937',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  noteContainer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});