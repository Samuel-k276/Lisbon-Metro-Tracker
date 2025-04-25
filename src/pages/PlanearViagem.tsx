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
  ListItemText
} from '@mui/material';
import { stationMappings } from '../utils/stationMappings';
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
    transbordos: number;
    rota: Array<{
      tipo: string;
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

  // Função para calcular a rota (versão mockada para o conceito)
  const calcularRota = () => {
    // Verificar se origem e destino foram selecionados
    if (!origem || !destino) {
      alert('Por favor, selecione a origem e o destino');
      return;
    }

    // Implementação básica para demonstração do conceito
    // Na versão final, isso usará algoritmos de roteamento, como Dijkstra
    const origemStation = estacoes.find(s => s.id === origem);
    const destinoStation = estacoes.find(s => s.id === destino);

    if (!origemStation || !destinoStation) return;

    // Mock de uma rota simples para demonstração
    // Em uma implementação real, isso seria calculado por algoritmos de pathfinding
    let rotaMock = [];
    const tempoMedioEntreEstacoes = 3; // minutos em média

    // Caso simples: mesma linha
    if (origemStation.lines.some(l => destinoStation.lines.includes(l))) {
      const linhaComum = origemStation.lines.find(l => destinoStation.lines.includes(l)) || '';
      const estacoesDaLinha = Object.values(stationMappings)
        .filter(s => s.lines.includes(linhaComum))
        .map(s => s.id);
      
      const origemIndex = estacoesDaLinha.indexOf(origem);
      const destinoIndex = estacoesDaLinha.indexOf(destino);
      const numEstacoes = Math.abs(origemIndex - destinoIndex);

      rotaMock.push({
        tipo: 'viagem',
        de: origemStation.name,
        para: destinoStation.name,
        linha: linhaComum,
        tempo: numEstacoes * tempoMedioEntreEstacoes,
        estacoes: numEstacoes
      });
    } 
    // Caso com um transbordo
    else {
      // Encontrar uma estação de transbordo
      const estacaoTransbordo = Object.values(stationMappings).find(s => 
        s.isTransfer && 
        origemStation.lines.some(l => s.lines.includes(l)) && 
        destinoStation.lines.some(l => s.lines.includes(l))
      );

      if (estacaoTransbordo) {
        const linhaOrigem = origemStation.lines.find(l => estacaoTransbordo.lines.includes(l)) || '';
        const linhaDestino = destinoStation.lines.find(l => estacaoTransbordo.lines.includes(l)) || '';
        
        // Primeira parte da viagem
        rotaMock.push({
          tipo: 'viagem',
          de: origemStation.name,
          para: estacaoTransbordo.name,
          linha: linhaOrigem,
          tempo: 8,
          estacoes: 4
        });

        // Transbordo
        rotaMock.push({
          tipo: 'transbordo',
          de: linhaOrigem,
          para: linhaDestino,
          tempo: 3,
          estacoes: 0
        });

        // Segunda parte da viagem
        rotaMock.push({
          tipo: 'viagem',
          de: estacaoTransbordo.name,
          para: destinoStation.name,
          linha: linhaDestino,
          tempo: 6,
          estacoes: 3
        });
      } else {
        // Caso complexo (exemplo simplificado)
        const linhaOrigem = origemStation.lines[0];
        const linhaDestino = destinoStation.lines[0];
        
        rotaMock.push({
          tipo: 'viagem',
          de: origemStation.name,
          para: 'Saldanha',
          linha: linhaOrigem,
          tempo: 10,
          estacoes: 5
        });
        
        rotaMock.push({
          tipo: 'transbordo',
          de: linhaOrigem,
          para: 'Amarela',
          tempo: 3,
          estacoes: 0
        });
        
        rotaMock.push({
          tipo: 'viagem',
          de: 'Saldanha',
          para: 'Campo Grande',
          linha: 'Amarela',
          tempo: 6,
          estacoes: 3
        });
        
        rotaMock.push({
          tipo: 'transbordo',
          de: 'Amarela',
          para: linhaDestino,
          tempo: 3,
          estacoes: 0
        });
        
        rotaMock.push({
          tipo: 'viagem',
          de: 'Campo Grande',
          para: destinoStation.name,
          linha: linhaDestino,
          tempo: 8,
          estacoes: 4
        });
      }
    }

    // Calcular totais
    const tempoTotal = rotaMock.reduce((total, etapa) => total + etapa.tempo, 0);
    const estacoesPart = rotaMock.reduce((total, etapa) => total + etapa.estacoes, 0);
    const transbordos = rotaMock.filter(etapa => etapa.tipo === 'transbordo').length;

    setResultados({
      tempoTotal,
      estacoes: estacoesPart,
      transbordos,
      rota: rotaMock 
    });
  };

  // Função para obter a cor da linha do metro
  const getLineColor = (lineName: string) => {
    if (!lineName) return '#888';
    
    const lineColors: Record<string, string> = {
      'Azul': '#0075BF',
      'Amarela': '#FFD800',
      'Verde': '#00A9A6',
      'Vermelha': '#ED1C24'
    };
    
    return lineColors[lineName] || '#888';
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Planear Viagem
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          Use este planejador para calcular a melhor rota entre duas estações do Metro de Lisboa. 
          O sistema vai calcular o caminho mais rápido, incluindo transferências necessárias.
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
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
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
                  Transbordos
                </Typography>
                <Typography variant="h6">
                  {resultados.transbordos}
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
                            Transbordo: 
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