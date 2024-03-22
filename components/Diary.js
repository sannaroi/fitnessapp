import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Diary() {
  const [exercise, setExercise] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);

  const addExercise = () => {
    const newExercise = {
      id: Math.random().toString(),
      exercise: exercise,
      description: description,
      date: date,
      duration: duration
    };
    setDiaryEntries([newExercise, ...diaryEntries]); // Lisätään uusi harjoitus ensimmäiseksi taulukkoon
    setExercise('');
    setDescription('');
    setDate('');
    setDuration('');
  };

  const deleteExercise = (id) => {
    setDiaryEntries(diaryEntries.filter(item => item.id !== id));
  };

  const editExercise = (id) => {
    const exerciseToEdit = diaryEntries.find(item => item.id === id);
    setExercise(exerciseToEdit.exercise);
    setDescription(exerciseToEdit.description);
    setDate(exerciseToEdit.date);
    setDuration(exerciseToEdit.duration);
    deleteExercise(id);
  };

  return (
    <View style={styles.container}>
      <Text>Add Exercise:</Text>
      <TextInput
        style={styles.input}
        value={exercise}
        onChangeText={setExercise}
        placeholder="Exercise"
      />
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Date"
      />
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="Duration"
      />
      <Button title="Save" onPress={addExercise} />
      <FlatList
        data={diaryEntries.sort((a, b) => new Date(b.date) - new Date(a.date))} 
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>Exercise: {item.exercise}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Duration: {item.duration}</Text>
            <View style={styles.icons}>
              <TouchableOpacity onPress={() => editExercise(item.id)}>
                <Ionicons name="create" size={24} color="blue" style={{ marginRight: 10 }} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteExercise(item.id)}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  entry: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
});
