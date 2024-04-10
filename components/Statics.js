import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Pedometer } from 'expo-sensors';
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

      const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const today = new Date();
      const todayIndex = weekdays.indexOf(today.toLocaleDateString('en-US', { weekday: 'short' }));

      const dailyStepCounts = weekdays.map(async (day, index) => {
        const start = new Date();
        start.setDate(start.getDate() - (todayIndex - index));
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const dailyStepCountResult = await Pedometer.getStepCountAsync(start, end);
        return { day, steps: dailyStepCountResult.steps };
      });


      const resolvedCounts = await Promise.all(dailyStepCounts);
      setDailyStepData(resolvedCounts);

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
              datasets: [{ data: dailyStepData.map(data => Math.floor(data.steps)) }]
            }}
            width={350}
            height={300}
            yAxisSuffix=""
            yAxisInterval={5000}
            yAxisBounds={[0, 10000]}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              barPercentage: 0.6,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={{ borderColor: 'black', borderWidth: 1 }}
            withInnerLines={true}
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
});
