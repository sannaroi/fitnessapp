import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import { ListItem } from '@rneui/base';
import { Button } from 'react-native-paper';

export default function Diary() {
  const [exercise, setExercise] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([]);

  const addExercise = () => {
    const currentDate = new Date().toISOString().slice(0, 10); 
    const newExercise = {
      id: Math.random().toString(),
      exercise: exercise,
      description: description,
      date: currentDate,
      duration: duration
    };
    setDiaryEntries([newExercise, ...diaryEntries]); 
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
      <Input
        value={exercise}
        onChangeText={setExercise}
        placeholder="Exercise"
      />
      <Input
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
      />
     
      <Input
        value={duration}
        onChangeText={setDuration}
        placeholder="Duration"
      />
      <Button onPress={addExercise} radius="lg" style={styles.saveButton}>
        Save
      </Button>
      <FlatList
  data={diaryEntries.sort((a, b) => new Date(b.date) - new Date(a.date))} 
  renderItem={({ item }) => (
    <View style={styles.entry}>
      <ListItem.Content>
        <ListItem.Title>{item.exercise} {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}, {new Date(item.date).getFullYear()}
        <TouchableOpacity onPress={() => editExercise(item.id)}>
          <Ionicons name="create" size={24} color="#00ACC1" style={{ marginLeft: 110 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteExercise(item.id)}>
          <Ionicons name="trash" size={24} color="#EC407A" />
        </TouchableOpacity>
        </ListItem.Title>
        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
        <ListItem.Subtitle>{item.duration}</ListItem.Subtitle>
      </ListItem.Content>
      <View style={styles.icons}>
      </View>
    </View>
  )}
  keyExtractor={(item) => item.id}
  extraData={diaryEntries}
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
  saveButton: {
    backgroundColor: '#c7ecee',
  }
});
