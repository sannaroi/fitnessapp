import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';


// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUsLEVd5IbCGMpFgnTs9l6IQFM_B2hVh4",
  authDomain: "fitnessapp-b0d5c.firebaseapp.com",
  projectId: "fitnessapp-b0d5c",
  storageBucket: "fitnessapp-b0d5c.appspot.com",
  messagingSenderId: "858970749496",
  appId: "1:858970749496:web:124cb10e095d84a771c4cd",
  databaseURL: "https://fitness-app-f28fa-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default function Statics() {
  const [stepCount, setStepCount] = useState(0);

  useEffect(() => {
    const db = getDatabase();
    const stepCountRef = ref(db, 'stepCount');
  
    onValue(stepCountRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Received step count:', data);
      setStepCount(data || 0);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Step Count: {stepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});