import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Pedometer } from 'expo-sensors';
import Svg, { Circle, Rect } from 'react-native-svg';
import { BarChart } from 'react-native-chart-kit';

export default function Statics() {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [monthlyStepCount, setMonthlyStepCount] = useState(0);
  const [weeklyStepCount, setWeeklyStepCount] = useState(0);
  const [dailyStepCount, setDailyStepCount] = useState(0);
  const [dailyStepData, setDailyStepData] = useState([]);

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
      dailyStart.setDate(dailyStart.getDate() - 6); 
      const dailyStepCounts = [];
      const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (i = 0; i < 7; i++) {
        const currentDay = new Date(dailyStart);
        currentDay.setDate(currentDay.getDate() + i);
        const dailyStepCountResult = await Pedometer.getStepCountAsync(currentDay, currentDay);
        if (dailyStepCountResult) {
          dailyStepCounts.push({ day: weekdays[currentDay.getDay()], steps: dailyStepCountResult.steps });
        }
      }
      console.log(dailyStepCounts);
      setDailyStepData(dailyStepCounts);

      return Pedometer.watchStepCount(result => {
        setDailyStepCount(result.steps);
      });
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    console.log(dailyStepData);
    return () => subscription;
  }, []);

  return (
    <ImageBackground source={require('./juoksu.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text>Monthly steps: {monthlyStepCount}</Text>
        </View>
        <View style={styles.box}>
          <Text>Weekly steps: {weeklyStepCount}</Text>
        </View>
        <View style={styles.box}>
          <Text>Daily steps: {dailyStepCount}</Text>
        </View>
        <View style={styles.chartContainer}>
          <BarChart
            data={{
              labels: dailyStepData.map(data => data.day),
              datasets: [{ data: dailyStepData.map(data => data.steps) }]
            }}
            width={350}
            height={300}
            yAxisSuffix=""
            yAxisInterval=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              barPercentage: 0.6,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              
            }}
            style={{ borderColor: 'black', borderWidth:1}}
            withInnerLines= {false}
            verticalLabelRotation={50}
            showValuesOnTopOfBars
            
          />
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
    resizeMode: 'cover', 
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
