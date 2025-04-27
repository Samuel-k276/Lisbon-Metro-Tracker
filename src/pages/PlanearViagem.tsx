import React, { useState } from 'react';
import { 
  Typography, 
  Container, 
  Box, 
  Paper, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { stationMappings } from '../utils/stationMappings';
import { metroGraph } from '../utils/graph';
import { getLineColor } from '../utils/staticData';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SwapVertIcon from '@mui/icons-material/SwapVert';

const PlanearViagem: React.FC = () => {
  // Estado para a origem, destino e resultados
  const [origem, setOrigem] = useState<string>('');
  const [destino, setDestino] = useState<string>('');
  const [resultados, setResultados] = useState<{
    tempoTotal: number;
    estacoes: number;
    trocasLinha: number;
    rota: Array<{
      tipo: 'viagem' | 'troca de linha';
      de: string;
      para: string;
      linha?: string;
      tempo: number;
      estacoes: number;
    }>;
  } | null>(null);

  // Lista de todas as estações para o seletor
  const estacoes = Object.values(stationMappings)
    .map(station => ({
      id: station.id,
      name: station.name,
      lines: station.lines
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Função para trocar origem e destino
  const trocarOrigemDestino = () => {
    const temp = origem;
    setOrigem(destino);
    setDestino(temp);
  };

  // Função para calcular a rota usando o algoritmo de Dijkstra com custo adicional para trocas de linha
  const calcularRota = () => {
    // Verificar se origem e destino foram selecionados
    if (!origem || !destino) {
      alert('Por favor, selecione a origem e o destino');
      return;
    }

    // Usamos o algoritmo de Dijkstra do grafo do metro
    const resultado = metroGraph.shortestPath(
      origem, 
      destino, 
    );
        
    // Formatamos o resultado para exibição na UI
    const rotaProcessada = metroGraph.formatPathForUI(resultado);
    
    // Calculamos o tempo total estimado (2 min por estação + tempo de trocas de linha)
    const tempoTotal = rotaProcessada.segments.reduce((total, segment) => total + segment.tempo, 0);
    
    // Contamos o número total de estações
    const estacoesPart = rotaProcessada.segments
      .filter(segment => segment.tipo === 'viagem')
      .reduce((total, segment) => total + segment.estacoes, 0);
    
    setResultados({
      tempoTotal,
      estacoes: estacoesPart,
      trocasLinha: rotaProcessada.transbordos,
      rota: rotaProcessada.segments.map(segment => ({
        ...segment,
        tipo: segment.tipo === 'transbordo' ? 'troca de linha' : 'viagem'
      }))
    });
  };


  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Planear Viagem
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Use este planejador para calcular a melhor rota entre duas estações do Metro de Lisboa. 
          O sistema vai calcular o caminho mais rápido, incluindo trocas de linha necessárias.
        </Typography>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="origem-label">Estação de Origem</InputLabel>
            <Select
              labelId="origem-label"
              id="origem-select"
              value={origem}
              label="Estação de Origem"
              onChange={e => setOrigem(e.target.value as string)}
            >
              {estacoes.map(estacao => (
                <MenuItem key={estacao.id} value={estacao.id}>
                  {estacao.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            onClick={trocarOrigemDestino}
            sx={{ 
              minWidth: '48px', 
              height: '48px',
              p: 0
            }}
          >
            <SwapVertIcon />
          </Button>
          
          <FormControl fullWidth>
            <InputLabel id="destino-label">Estação de Destino</InputLabel>
            <Select
              labelId="destino-label"
              id="destino-select"
              value={destino}
              label="Estação de Destino"
              onChange={e => setDestino(e.target.value as string)}
            >
              {estacoes.map(estacao => (
                <MenuItem key={estacao.id} value={estacao.id}>
                  {estacao.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
       
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={calcularRota}
            sx={{ 
              minWidth: '200px',
              backgroundColor: '#009048',
              '&:hover': {
                backgroundColor: '#006633',
              }
            }}
          >
            Calcular Rota
          </Button>
        </Box>
      </Paper>
      
      {resultados && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Resultado
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              minWidth: '150px'
            }}>
              <AccessTimeIcon sx={{ mr: 1, color: '#009048' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tempo Total
                </Typography>
                <Typography variant="h6">
                  {resultados.tempoTotal} min
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              minWidth: '150px'
            }}>
              <TrainIcon sx={{ mr: 1, color: '#009048' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Estações
                </Typography>
                <Typography variant="h6">
                  {resultados.estacoes}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              p: 1, 
              border: '1px solid #e0e0e0', 
              borderRadius: 1,
              minWidth: '150px'
            }}>
              <SwapVertIcon sx={{ mr: 1, color: '#009048' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Trocas de Linha
                </Typography>
                <Typography variant="h6">
                  {resultados.trocasLinha}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Itinerário Detalhado
          </Typography>
          
          <List>
            {resultados.rota.map((etapa, index) => {
              if (etapa.tipo === 'viagem') {
                return (
                  <ListItem
                    key={index}
                    sx={{ 
                      py: 2, 
                      borderLeft: `4px solid ${getLineColor(etapa.linha || '')}`,
                      pl: 2,
                      mb: 1,
                      backgroundColor: '#f9f9f9',
                      borderRadius: '0 4px 4px 0'
                    }}
                  >
                    <ListItemIcon>
                      <TrainIcon 
                        sx={{ 
                          color: getLineColor(etapa.linha || '') 
                        }} 
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                          <Typography variant="body1">
                            {etapa.de} → {etapa.para}
                          </Typography>
                          <Chip 
                            label={etapa.linha} 
                            size="small" 
                            sx={{ 
                              bgcolor: getLineColor(etapa.linha || ''),
                              color: etapa.linha === 'Amarela' ? '#000' : '#fff',
                              ml: 1
                            }} 
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {etapa.estacoes} estações • {etapa.tempo} minutos
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              } else {
                return (
                  <ListItem
                    key={index}
                    sx={{ 
                      py: 1.5, 
                      pl: 2,
                      mb: 1,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      borderLeft: '4px dashed #999'
                    }}
                  >
                    <ListItemIcon>
                      <DirectionsWalkIcon sx={{ color: '#666' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">
                            Troca de Linha: 
                          </Typography>
                          <Chip 
                            label={etapa.de} 
                            size="small" 
                            sx={{ 
                              bgcolor: getLineColor(etapa.de || ''),
                              color: etapa.de === 'Amarela' ? '#000' : '#fff'
                            }}
                          />
                          <Typography variant="body1">→</Typography>
                          <Chip 
                            label={etapa.para} 
                            size="small" 
                            sx={{ 
                              bgcolor: getLineColor(etapa.para || ''),
                              color: etapa.para === 'Amarela' ? '#000' : '#fff'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          Tempo estimado: {etapa.tempo} minutos
                        </Typography>
                      }
                    />
                  </ListItem>
                );
              }
            })}
          </List>
                    
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Nota:</strong> Este é um planejador conceitual. Os tempos são estimativas e podem variar 
              conforme o horário, lotação das estações e outros fatores. Este sistema não leva em conta 
              horários específicos de operação ou possíveis perturbações no serviço.
            </Typography>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default PlanearViagem;