import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';

const MainScreen = () => {
  const [dashboard, setDashboard] = useState({
    solicitacoes: 0,
    solicitantes: 0,
    itensDeAnalise: {
      _sum: {
        quantidadeDisponivel: 0,
      },
    },
    ensaiosPendente: 2,
    ensaiosEmAndamento: 10,
    ensaiosConcluidos: 20,
  });

  const getDashboard = async () => {
    const response = await axios.get('https://uno-production.up.railway.app/dashboard');
    setDashboard(response.data);
  };

  useEffect(() => {
    getDashboard();
  }, []);

  const data = {
    labels: ['Pendente', 'Em Andamento', 'Concluídos'],
    datasets: [
      {
        data: [dashboard.ensaiosPendente, dashboard.ensaiosEmAndamento, dashboard.ensaiosConcluidos],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dashboard</Text>
        <Text style={styles.subHeaderText}>Visão geral das informações do laboratório</Text>
      </View>
  
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Total de Solicitações de Análise: {dashboard.solicitacoes}</Text>
        <Text style={styles.infoText}>Total de solicitantes cadastrados: {dashboard.solicitantes}</Text>
        <Text style={styles.infoText}>Total de itens de análise disponíveis: {dashboard.itensDeAnalise._sum.quantidadeDisponivel}</Text>
      </View>
  
      <View style={styles.chartContainer}>
        <Text style={styles.chartHeaderText}>Ensaios</Text>
        <BarChart
          data={data}
          width={350}
          height={200}
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
          fromZero={true} // Esta é a nova configuração
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
        <Text style={styles.chartStatusText}>Status dos ensaios no laboratório</Text>
      </View>
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
});

export default MainScreen;
