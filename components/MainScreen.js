import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import MenuModal from './MenuModal'; // Componente modal para o menu
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MainScreen = ({ navigation }) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [frequenciasTipoAnalise, setFrequenciasTipoAnalise] = useState([]);
  const [solicitacoesFinalizadasXAndamento, setSolicitacoesFinalizadasXAndamento] = useState([]);

  useEffect(() => {
    getTipoAnaliseHistogram();
    getProgressoSolicitacoesAnalise();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => navigation.navigate('MainScreen')}>
          <Image source={require('../assets/Logo.png')} style={styles.headerLogo} />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center', // Centraliza o título do cabeçalho
    });
  }, [navigation]);

  const fetchSolicitacoesAnalise = async () => {
    const { data } = await axios.get(
      'https://uno-api-pdre.onrender.com/api/v1/solicitacao-analise/listagem'
    );
    return data;
  };

  const getTipoAnaliseHistogram = async () => {
    const hist = new Map();
    const data = await fetchSolicitacoesAnalise();
    data.forEach((solicitacaoAnalise) => {
      if (hist.has(solicitacaoAnalise.tipoAnalise)) {
        hist.set(
          solicitacaoAnalise.tipoAnalise,
          hist.get(solicitacaoAnalise.tipoAnalise) + 1
        );
      } else {
        hist.set(solicitacaoAnalise.tipoAnalise, 1);
      }
    });

    const chartData = Array.from(hist.keys()).map((key, index) => ({
      name: key,
      population: hist.get(key),
      color: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
      ][index % 5],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    setFrequenciasTipoAnalise(chartData);
  };

  const getProgressoSolicitacoesAnalise = async () => {
    const hist = new Map();
    const data = await fetchSolicitacoesAnalise();
    data.forEach((solicitacaoAnalise) => {
      const status = !!solicitacaoAnalise.conclusaoProjeto;
      const key = status ? 'Concluído' : 'Em Andamento';

      if (hist.has(key)) {
        hist.set(key, hist.get(key) + 1);
      } else {
        hist.set(key, 1);
      }
    });

    const chartData = Array.from(hist.keys()).map((key, index) => ({
      name: key,
      population: hist.get(key),
      color: [
        'rgb(255, 99, 132)',
        'rgb(75, 192, 192)',
        'rgb(255, 205, 86)',
        'rgb(201, 203, 207)',
        'rgb(54, 162, 235)',
      ][index % 5],
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    }));

    setSolicitacoesFinalizadasXAndamento(chartData);
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View style={styles.container}>
      {/* Botão para abrir o menu */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setIsMenuVisible(true)}
      >
        <Text style={styles.menuButtonText}>☰ Menu</Text>
      </TouchableOpacity>

      {/* Componente modal para o menu */}
      <MenuModal
        isVisible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNavigate={(screen) => {
          setIsMenuVisible(false);
          navigation.navigate(screen);
        }}
      />

      {/* Dashboard */}
      <ScrollView style={styles.dashboardContainer}>
        <Text style={styles.heading}>Dashboard</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Tipos de análise mais solicitadas</Text>
          <PieChart
            data={frequenciasTipoAnalise}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Progresso das Solicitações de Análise</Text>
          <PieChart
            data={solicitacoesFinalizadasXAndamento}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos para os componentes
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    zIndex: 1, // Garante que o botão de menu esteja em cima do ScrollView
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  dashboardContainer: {
    flex: 1,
    width: '100%',
    padding: 20,
    marginTop: 50, // Certifica-se de que o ScrollView não cobre o botão de menu
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  headerLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});

export default MainScreen;
