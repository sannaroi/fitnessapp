import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [monthlyStepCount, setMonthlyStepCount] = useState(0);
  const [weeklyStepCount, setWeeklyStepCount] = useState(0);
  const [dailyStepCount, setDailyStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(String(isAvailable));

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 1);

      const monthlyStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (monthlyStepCountResult) {
        setMonthlyStepCount(monthlyStepCountResult.steps);
      }

      const weeklyStart = new Date();
      weeklyStart.setDate(weeklyStart.getDate() - 7);
      const weeklyStepCountResult = await Pedometer.getStepCountAsync(weeklyStart, end);
      if (weeklyStepCountResult) {
        setWeeklyStepCount(weeklyStepCountResult.steps);
      }

      const dailyStart = new Date();
      dailyStart.setDate(dailyStart.getDate() - 1);
      const dailyStepCountResult = await Pedometer.getStepCountAsync(dailyStart, end);
      if (dailyStepCountResult) {
        setDailyStepCount(dailyStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setDailyStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    return () => subscription;
  }, []);

  return (
    <ImageBackground source={require('./juoksu.jpg')} style={styles.backgroundImage}>
  <View style={styles.container}>
    {/* 
    <View style={styles.box}>
      <Text>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
    </View>
    */}
    <View style={styles.box}>
      <Text>Monthly steps: {monthlyStepCount}</Text>
    </View>
    <View style={styles.box}>
      <Text>Weekly steps: {weeklyStepCount}</Text>
    </View>
    <View style={styles.box}>
      <Text>Daily steps: {dailyStepCount}</Text>
    </View>
  </View>
</ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    backgroundColor: '#c7ecee'
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // tai 'stretch' tai 'contain'
  },
  
});
