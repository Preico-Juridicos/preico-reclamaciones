import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ClaimCard = ({ claim }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{claim.title}</Text>
      <Text style={styles.status}>{claim.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2e8cf',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
});

export default ClaimCard;
