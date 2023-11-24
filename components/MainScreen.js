import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MenuModal from './MenuModal';
import en from '../locales/en.json';
import pt from '../locales/pt.json';

const MainScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [dashboard, setDashboard] = useState({
    solicitacoes: 0,
    solicitantes: 0,
    itensDeAnalise: {
      _sum: {
        quantidadeDisponivel: 0,
      },
    },
    ensaios: 0,
    ensaiosPendente: 0,
    ensaiosEmAndamento: 0,
    ensaiosConcluidos: 0,
  });

  const translations = {
    english: en,
    portuguese: pt,
  };  

  const [language, setLanguage] = useState('portuguese');

  const getLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('@language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
        
      }
    } catch (error) {
      console.error('Error reading language from AsyncStorage', error);
    }
  };

  const saveLanguage = async (selectedLanguage) => {
    try {
      await AsyncStorage.setItem('@language', selectedLanguage);
      setLanguage(selectedLanguage);
    } catch (error) {
      console.error('Error saving language to AsyncStorage', error);
    }
  };

  const toggleLanguage = async () => {
    const newLanguage = language === 'portuguese' ? 'english' : 'portuguese';
    saveLanguage(newLanguage);
  };
  

  const getDashboard = async () => {
    const response = await axios.get('https://uno-lims.up.railway.app/dashboard');
    setDashboard(response.data);
  };

  useEffect(() => {
    getDashboard();
    getLanguage();
  }, []);


  const handleExitApp = () => {
    showExitConfirmation();
  };

  const showExitConfirmation = () => {
    Alert.alert(
      'Confirmação',
      'Deseja realmente sair do aplicativo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', onPress: () => BackHandler.exitApp() },
      ],
      { cancelable: false }
    );
  };

  const data = {
    labels: [translations[language].Ensaios, translations[language].Pendentes, translations[language].EmAndamento, translations[language].Concluidos],
    datasets: [
      {
        label: 'Ensaios',
        data: [
          dashboard.ensaios,
          dashboard.ensaiosPendente,
          dashboard.ensaiosEmAndamento,
          dashboard.ensaiosConcluidos,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuVisible(true)}
      >
        <Text style={styles.menuButtonText}>☰ Menu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.languageButton}
        onPress={toggleLanguage} 
      >
        <Text style={styles.languageButtonText}>
          {language === 'portuguese' ? 'Português' : 'English'}
        </Text>
      </TouchableOpacity>

      <MenuModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={(screen) => {
          setIsMenuVisible(false);
          navigation.navigate(screen);
        }}
      />
      <View style={styles.header}>
      <Text style={styles.headerText}>{translations[language].dashboard}</Text>
        <Text style={styles.subHeaderText}>{translations[language].overview}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {translations[language].totalRequests.replace('%{count}',dashboard.solicitacoes.toString())}
          </Text>
        <Text style={styles.infoText}>
          {translations[language].totalApplicants.replace('%{count}',dashboard.solicitantes.toString())}
        </Text>
        <Text style={styles.infoText}>
          {translations[language].availableAnalysisItems.replace('%{count}',dashboard.itensDeAnalise._sum.quantidadeDisponivel.toString())}
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartHeaderText}>{translations[language].tests}</Text>
        <BarChart
          data={data}
          width={400}
          height={300}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          fromZero={true}
          showValuesOnTopOfBars={true}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <Text style={styles.chartStatusText}>{translations[language].testsStatus}</Text>
      </View>

      <TouchableOpacity style={styles.exitButton} onPress={handleExitApp}>
      <Text style={styles.exitButtonText}>{translations[language].exit}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: '#333',
  },
  subHeaderText: {
    fontSize: 16,
    color: '#555',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  chartHeaderText: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#333',
  },
  chartStatusText: {
    fontSize: 14,
    color: '#555',
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    left: 20,
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  exitButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: '#3A01DF',
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  languageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default MainScreen;
