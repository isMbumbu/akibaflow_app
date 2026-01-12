import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAccountsQuery } from '../../server/accountsApi';
import { useGetTransactionsQuery } from '../../server/transactionsApi';
import { Transaction } from '../../server/types';
import { RootState } from '../../store';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: accounts } = useGetAccountsQuery();
  const { data: transactionsData, isLoading, error } = useGetTransactionsQuery({ limit: 5 });

  const totalBalance = accounts?.reduce((sum, account) => sum + parseFloat(account.current_balance || '0'), 0) || 0;

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionRow}>
      <View style={styles.transactionLeft}>
        <View style={styles.transactionIcon}>
          <Text style={styles.iconText}>{item.description[0]}</Text>
        </View>
        <View>
          <Text style={styles.transactionName}>{item.description}</Text>
          <Text style={styles.transactionDate}>{new Date(item.transaction_date).toLocaleDateString()}</Text>
        </View>
      </View>
      <Text style={[styles.transactionAmount, { color: item.transaction_type === 'INCOME' ? '#10B981' : '#EF4444' }]}>
        {item.transaction_type === 'INCOME' ? '+' : '-'}KES {parseFloat(item.amount || '0').toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome Back, {user?.first_name || 'User'}!</Text>
      
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>KES {totalBalance.toFixed(2)}</Text>
        <View style={styles.balanceIcon}>
          <Text style={styles.iconText}>🏦</Text>
        </View>
      </View>

      <View style={styles.transactionsCard}>
        <Text style={styles.sectionTitle}>Latest Transactions</Text>
        {isLoading && <Text>Loading transactions...</Text>}
        {error && <Text style={{ color: 'red' }}>Error loading transactions: {JSON.stringify(error)}</Text>}
        {transactionsData && transactionsData.length === 0 && !isLoading && (
          <Text style={{ color: '#6B7280', textAlign: 'center', padding: 20 }}>No transactions yet</Text>
        )}
        <FlatList
          data={transactionsData}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          style={styles.transactionsList}
        />
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('/add-transaction')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 24,
    marginTop: 60,
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#334155',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 8,
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  balanceIcon: {
    position: 'absolute',
    top: 28,
    right: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  transactionsCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  transactionsList: {
    flex: 1,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '400',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
});
