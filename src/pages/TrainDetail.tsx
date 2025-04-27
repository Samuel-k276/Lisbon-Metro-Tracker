import React from 'react';
import { Typography, Box, Container, Paper, Chip, CircularProgress } from '@mui/material';
import { useTrain } from '../hooks/useTrain';
import { getStationNameById } from '../utils/metroUtils';
import { formatTimeInSeconds } from '../utils/helpers';
import { lines } from '../utils/staticData';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import TrainIcon from '@mui/icons-material/Train';

interface TrainDetailProps {
  trainId: string;
}

const TrainDetail: React.FC<TrainDetailProps> = ({ trainId }) => {
  const { train, trainInfo, loading, error } = useTrain(trainId);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !train || !trainInfo) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Train information not available'}
          </Typography>
          <Typography>
            The train you're looking for may have completed its journey or the information is temporarily unavailable.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '8px', 
          backgroundColor: trainInfo.lineColor
        }} />
        
        <Box sx={{ pt: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrainIcon sx={{ fontSize: 35, color: trainInfo.lineColor }} />
            Train {trainId}
            <Chip 
              label={trainInfo.line} 
              sx={{ 
                ml: 2, 
                backgroundColor: trainInfo.lineColor,
                color: trainInfo.line === 'Amarela' ? '#000' : '#fff',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }} 
            />
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            pl: 1
          }}>
            <Typography variant="h6" color="text.secondary">
              Direction: 
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              sx={{ ml: 1 }}
            >
              {trainInfo.destination}
            </Typography>
          </Box>
        </Box>

        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
            Journey Information
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: 2,
            mt: 3 
          }}>
            {trainInfo.nextStations.map((station, index) => (
              <Box 
                key={`${station.stationId}-${index}`} 
                sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  py: 1,
                  borderBottom: index < trainInfo.nextStations.length - 1 ? '1px dashed #eee' : 'none'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    backgroundColor: trainInfo.lineColor,
                    border: '2px solid white',
                    boxShadow: '0 0 0 1px #ccc'
                  }} />
                  <Typography fontWeight={index === 0 ? 'bold' : 'regular'}>
                    {station.stationName}
                  </Typography>
                  {index === 0 && (
                    <Chip 
                      label="Next station" 
                      size="small" 
                      sx={{ 
                        ml: 1, 
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        fontSize: '0.7rem' 
                      }} 
                    />
                  )}
                </Box>
                <Typography 
                  sx={{ 
                    backgroundColor: index === 0 ? '#f5f5f5' : 'transparent',
                    px: index === 0 ? 2 : 0,
                    py: index === 0 ? 0.5 : 0,
                    borderRadius: index === 0 ? 4 : 0,
                    fontWeight: index === 0 ? 'bold' : 'regular'
                  }}
                >
                  {formatTimeInSeconds(station.arrivalTime)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ borderBottom: '1px solid #eee', pb: 1 }}>
            Line Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">Line:</Typography>
              <Typography variant="body1" fontWeight="bold">{trainInfo.line}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">Terminals:</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {lines[trainInfo.line]?.stations && (
                  <>
                    <Typography variant="body1" fontWeight="medium">
                      {getStationNameById(lines[trainInfo.line].stations[0])}
                    </Typography>
                    <ArrowRightAltIcon sx={{ mx: 1 }} />
                    <Typography variant="body1" fontWeight="medium">
                      {getStationNameById(lines[trainInfo.line].stations[lines[trainInfo.line].stations.length - 1])}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">Total Stations:</Typography>
              <Typography variant="body1" fontWeight="bold">
                {lines[trainInfo.line]?.stations?.length || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Paper>
    </Container>
  );
};

export default TrainDetail;