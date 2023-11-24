// import React, { useEffect, useState, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import en from '../locales/en.json';
// import pt from '../locales/pt.json';

// const [language, setLanguage] = useState('portuguese');

// const translations = {
//     english: en,
//     portuguese: pt,
//   };  

// const getLanguage = async () => {
//     try {
//       const savedLanguage = await AsyncStorage.getItem('@language');
//       if (savedLanguage) {
//         setLanguage(savedLanguage);
//       }
//     } catch (error) {
//       console.error('Error reading language from AsyncStorage', error);
//     }
//   };

// export default language