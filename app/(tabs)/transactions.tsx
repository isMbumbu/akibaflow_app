import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetAccountsQuery } from '../../server/accountsApi';
import { useGetCategoriesQuery } from '../../server/categoriesApi';
import { useGetTransactionsQuery } from '../../server/transactionsApi';

export default function TransactionsScreen() {
  const { data: transactionsData, isLoading } = useGetTransactionsQuery({});
  const { data: accounts } = useGetAccountsQuery();
  const { data: categories } = useGetCategoriesQuery();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [filterCategory, setFilterCategory] = useState<number | null>(null);

  const filteredTransactions = useMemo(() => {
    if (!transactionsData) return [];

    return transactionsData.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'ALL' || transaction.transaction_type === filterType;
      const matchesCategory = filterCategory === null || transaction.category_id === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactionsData, searchQuery, filterType, filterCategory]);

  const getAccountName = (accountId: number) => {
    const account = accounts?.find((acc: any) => acc.id === accountId);
    return account?.name || `Account ${accountId}`;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat: any) => cat.id === categoryId);
    return category?.name || `Category ${categoryId}`;
  };

  const renderTransaction = ({ item }: { item: any }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <View style={[styles.typeIndicator, { backgroundColor: item.transaction_type === 'INCOME' ? '#10B981' : '#EF4444' }]} />
          <View>
            <Text style={styles.transactionDesc}>{item.description}</Text>
            <Text style={styles.transactionMeta}>
              {getAccountName(item.account_id)} • {getCategoryName(item.category_id)}
            </Text>
          </View>
        </View>
        <Text style={[styles.transactionAmount, { color: item.transaction_type === 'INCOME' ? '#10B981' : '#EF4444' }]}>
          {item.transaction_type === 'INCOME' ? '+' : '-'}KES {parseFloat(item.amount || '0').toFixed(2)}
        </Text>
      </View>
      <Text style={styles.transactionDate}>
        {new Date(item.transaction_date).toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </Text>
    </View>
  );

  const FilterButton = ({ title, active, onPress }: { title: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity
      style={[styles.filterButton, active && styles.filterButtonActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          title="All"
          active={filterType === 'ALL'}
          onPress={() => setFilterType('ALL')}
        />
        <FilterButton
          title="Income"
          active={filterType === 'INCOME'}
          onPress={() => setFilterType('INCOME')}
        />
        <FilterButton
          title="Expenses"
          active={filterType === 'EXPENSE'}
          onPress={() => setFilterType('EXPENSE')}
        />
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <TouchableOpacity
          style={[styles.categoryButton, filterCategory === null && styles.categoryButtonActive]}
          onPress={() => setFilterCategory(null)}
        >
          <Text style={[styles.categoryButtonText, filterCategory === null && styles.categoryButtonTextActive]}>
            All Categories
          </Text>
        </TouchableOpacity>
        {categories?.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[styles.categoryButton, filterCategory === category.id && styles.categoryButtonActive]}
            onPress={() => setFilterCategory(category.id)}
          >
            <Text style={[styles.categoryButtonText, filterCategory === category.id && styles.categoryButtonTextActive]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transactions List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      ) : filteredTransactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {searchQuery || filterType !== 'ALL' ? 'No transactions match your filters' : 'No transactions yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#0F172A',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 24,
    marginTop: 60,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  categoryFilterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  categoryButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  categoryButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  transactionCard: {
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
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  typeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 16,
    marginTop: 2,
  },
  transactionDesc: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  transactionMeta: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: '800',
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right',
    fontWeight: '500',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
