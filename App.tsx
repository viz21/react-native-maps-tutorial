import React, {useState} from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import CustomLocationSelector from './src/LocationSelector';

const App = () => {
  const [location, setLocation] = useState<string>('');

  return (
    <View style={styles.deatilSection}>
      <CustomLocationSelector
        label="Select Location"
        value={location}
        onSelect={coordinates => setLocation(coordinates)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btnStyle: {
    width: '90%',
    margin: 10,
  },
  deatilSection: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
  },
});

export default App;
