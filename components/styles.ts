// styles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    position: 'relative',
    bottom: 50, 
    width: 100, 
    height: 100,
  },
  welcomeText: {
    fontSize: 24,
    marginBottom: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 25,
    paddingLeft: 8,
    borderRadius: 10,
    width: '100%',
  },
  loginButton: {
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    fontSize: 18,
    marginRight: 5,
  },
  registerLink: {
    fontSize: 18,
    color: '#3A01DF',
    textDecorationLine: 'underline',
  },
});

export default styles;
