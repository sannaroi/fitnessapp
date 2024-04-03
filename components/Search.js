import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { Button, Input } from '@rneui/themed';

export default function Search() {
  const [muscleGroup, setMuscleGroup] = useState('');
  const [exerciseList, setExerciseList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchExercises = () => {
    setLoading(true);
    fetch(`https://exercisedb.p.rapidapi.com/exercises/target/${muscleGroup}?limit=25`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '9c323f6266msh5f287ec95332aefp16dbdbjsnae0fbebd4361',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      },
    })
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw new Error('Network response was not ok' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        setExerciseList(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching exercises:', error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter muscle group..."
        onChangeText={text => setMuscleGroup(text)}
        value={muscleGroup}
      />
      <Text>Ex. abs, biceps, lats, quads etc.</Text>
      <Button onPress={fetchExercises} radius="lg" style={styles.searchButton}>
        Search
      </Button>
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
      ) : (
      <FlatList
        style={{ marginTop: 10 }}
        data={exerciseList}
        renderItem={({ item }) => (
      <View style={styles.exerciseItem}>
        <Text style={styles.exerciseName}>{item.name}</Text>
        <Text>{item.description}</Text>
        <Image
          source={{ uri: item.gifUrl }}
          style={{ width: 200, height: 200 }} 
        />
      </View>
  )}
  keyExtractor={item => item.id.toString()}
/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    width: '80%',
    
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  loader: {
    marginTop: 20,
  },
  exerciseItem: {
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: 'rgba(219, 207, 226, 0.5)',
  }
});
