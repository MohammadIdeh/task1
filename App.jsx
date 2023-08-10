import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Linking } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users = await response.json();

      const user = users.find(user => user.email === email);

      if (user) {
        navigation.navigate('User', { email: user.email });
      } else {
        console.log('User not found. Displaying error message...');
      }

      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('./login.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        required
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
        required
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Create')}>
        <Text style={styles.createAccount}>Don't have an account? <Text style={styles.createLink}>Create</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const UserProfile = ({ route }) => {
  const { email } = route.params;

  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(users => {
        const user = users.find(user => user.email === email);
        if (user) {
          setUserDetails(user);
        } else {
          console.log('User not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [email]);

  const openWebsite = () => {
    if (userDetails && userDetails.website) {
      Linking.openURL(userDetails.website);
    }
  };

  return (
    <View style={styles.container}>
      {userDetails ? (
        <ScrollView contentContainerStyle={styles.profileContainer}>
          <Text style={styles.header}>User Profile</Text>
          <Text style={styles.name}>{userDetails.name}</Text>
          <Text>Email: {userDetails.email}</Text>
          <Text>Username: {userDetails.username}</Text>
          <Text>
            Address: {userDetails.address.street}, {userDetails.address.city}, {userDetails.address.zipcode}
          </Text>
          <Text>Phone: {userDetails.phone}</Text>
          <Text style={styles.website} onPress={openWebsite}>
            Website: {userDetails.website}
          </Text>
          <Text>Company: {userDetails.company.name}</Text>
        </ScrollView>
      ) : (
        <Text>User not found.</Text>
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="User" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 10,
  },
  input: {
    width: '70%',
    padding: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#ff0066',
    paddingVertical: 12,
    paddingHorizontal: 72,
    borderRadius: 100,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  forgotPassword: {
    fontSize: 14,
    marginTop: 20,
  },
  createAccount: {
    fontSize: 14,
    marginTop: 20,
  },
  createLink: {
    fontWeight: 'bold',
  },
  profileContainer: {
    backgroundColor: '#9bcbc5',
    padding: 30,
    borderRadius: 60,
    width: '80%',
  },
  header: {
    color: '#ff0000',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  name: {
    fontSize: 18,
    color: '#1518c1',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  website: {
    color: '#ff0101',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
});

export default App;
