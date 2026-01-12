import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetAccountsQuery } from '../server/accountsApi';
import { useGetCategoriesQuery } from '../server/categoriesApi';
import { useCreateTransactionMutation } from '../server/transactionsApi';

export default function AddTransactionScreen() {
  const router = useRouter();
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const { data: accounts } = useGetAccountsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async () => {
    if (!amount || !accountId || !categoryId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createTransaction({
        amount: parseFloat(amount),
        transaction_type: transactionType,
        account_id: parseInt(accountId),
        category_id: parseInt(categoryId),
        description,
        transaction_date: new Date(transactionDate).toISOString(),
      }).unwrap();
      Alert.alert('Success', 'Transaction added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>

      <Text style={styles.label}>Amount *</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="0.00"
      />

      <Text style={styles.label}>Type *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={transactionType}
          onValueChange={(itemValue: 'INCOME' | 'EXPENSE') => setTransactionType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Expense" value="EXPENSE" />
          <Picker.Item label="Income" value="INCOME" />
        </Picker>
      </View>

      <Text style={styles.label}>Account *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={accountId}
          onValueChange={(itemValue: string) => setAccountId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Account" value="" />
          {accounts?.map((account) => (
            <Picker.Item key={account.id} label={account.name} value={account.id.toString()} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Category *</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoryId}
          onValueChange={(itemValue: string) => setCategoryId(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Category" value="" />
          {categories?.map((category) => (
            <Picker.Item key={category.id} label={category.name} value={category.id.toString()} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Date</Text>
      <TextInput
        style={styles.input}
        value={transactionDate}
        onChangeText={setTransactionDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Transaction description"
        multiline
      />

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Adding...' : 'Add Transaction'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
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
    marginBottom: 20,
    color: '#1F2937',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#2F80ED',
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});