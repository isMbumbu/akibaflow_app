import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const data = [
  {
    name: 'Needs',
    population: 50,
    color: '#F59E0B',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Wants',
    population: 30,
    color: '#2F80ED',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Savings',
    population: 20,
    color: '#10B981',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

const chartConfig = {
  backgroundGradientFrom: '#0F172A',
  backgroundGradientTo: '#0F172A',
  color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const budgetCards = [
  { category: 'Food & Dining', spent: 450, budget: 600, color: '#F59E0B' },
  { category: 'Transportation', spent: 120, budget: 200, color: '#2F80ED' },
  { category: 'Entertainment', spent: 80, budget: 150, color: '#10B981' },
  { category: 'Utilities', spent: 200, budget: 250, color: '#EF4444' },
];

export default function BudgetsScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Budgets</Text>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>50/30/20 Rule</Text>
        <PieChart
          data={data}
          width={screenWidth - 80}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <Text style={styles.sectionTitle}>Category Budgets</Text>
      {budgetCards.map((item, index) => (
        <View key={index} style={styles.budgetCard}>
          <View style={styles.budgetHeader}>
            <Text style={styles.categoryName}>{item.category}</Text>
            <Text style={styles.budgetAmount}>${item.spent} / ${item.budget}</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(item.spent / item.budget) * 100}%`,
                  backgroundColor: item.color,
                },
              ]}
            />
          </View>
          <Text style={styles.remaining}>
            ${item.budget - item.spent} remaining
          </Text>
        </View>
      ))}
    </ScrollView>
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
  },
  chartCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 20,
  },
  budgetCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  budgetAmount: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 5,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  remaining: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'right',
    fontWeight: '500',
  },
});