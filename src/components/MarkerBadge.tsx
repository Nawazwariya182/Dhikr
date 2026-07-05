import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FONTS } from '../utils/constants';

interface MarkerBadgeProps {
  label: string;
  color: string;
}

export const MarkerBadge: React.FC<MarkerBadgeProps> = ({ label, color }) => (
  <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color + '40' }]}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={[styles.badgeText, { color }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontFamily: FONTS.english,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
