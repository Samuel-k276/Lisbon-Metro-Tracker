import React from 'react';
import { Typography, Box, Container, Paper, Chip } from '@mui/material';
import { useStation } from '../hooks/useStation';
import { formatTimeInSeconds } from '../utils/helpers';
import { getLineNameFromDestination } from '../utils/helpers';
import { getLineColor } from '../utils/metroUtils';

interface StationDetailProps {
   stationId: string;
}

const LineCircle: React.FC<{ line: string }> = ({ line }) => {
   const color = getLineColor(line);
   return (
      <Box
         component="span"
         sx={{
            display: 'inline-block',
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            backgroundColor: color,
            marginLeft: 1,
            verticalAlign: 'middle',
         }}
      />
   );
};

const StationDetail: React.FC<StationDetailProps> = ({ stationId }) => {
   const { station, loading, error } = useStation(stationId);

   if (loading) return <Typography>Loading...</Typography>;
   if (error) return <Typography color="error">Error loading station: {error}</Typography>;
   if (!station) return <Typography>Station not found</Typography>;

   return (
      <Container maxWidth="lg">
         <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 4 }}>
            <Box mb={3}>
               <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  {station.name}
                  {Array.isArray(station.lines) ? 
                     station.lines.map((line, index) => (
                        <LineCircle key={index} line={line} />
                     )) : 
                     <LineCircle line={station.lines} />
                  }
               </Typography>
               
               <Box display="flex" gap={1} mb={2}>
                    {station.nextTrains && [...station.nextTrains]
                      .sort((a, b) => {
                        // Get the line for each destination
                        const lineA = getLineNameFromDestination(a.destination);
                        const lineB = getLineNameFromDestination(b.destination);
                        
                        // First sort by line name
                        if (lineA !== lineB) {
                           return lineA.localeCompare(lineB);
                        }
                        // Then by destination name
                        return a.destination.localeCompare(b.destination);
                      })
                      .map(trains => (
                        <Chip 
                           key={trains.destination} 
                           label={trains.destination} 
                           color="primary"
                           variant="outlined"
                        />
                      ))}
                    {(!station.nextTrains || station.nextTrains.length === 0) && (
                      <Typography variant="body2" color="textSecondary">No destinations available</Typography>
                    )}
               </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
               <Box>
                  <Typography variant="h6">Information</Typography>
                  <Box mt={1}>
                     <Typography><strong>Name:</strong> {station.name}</Typography>
                     <Typography><strong>Lines:</strong> {Array.isArray(station.lines) ? station.lines.join(', ') : station.lines}</Typography>
                     <Typography><strong>Location:</strong> {[station.coordinates.x, station.coordinates.y].join(', ')}</Typography>
                  </Box>
               </Box>
               
               <Box>
                  <Typography variant="h6">Next Trains</Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                     <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                        <thead>
                           <tr>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Destination</th>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time 1</th>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time 2</th>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Time 3</th>
                           </tr>
                        </thead>
                        <tbody>
                           {station.nextTrains && station.nextTrains.length > 0 ? (
                              station.nextTrains.map((train, index) => (
                                 <tr key={index}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{train.destination}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatTimeInSeconds(train.time1)}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatTimeInSeconds(train.time2)}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{formatTimeInSeconds(train.time3)}</td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td colSpan={4} style={{ padding: '8px', textAlign: 'center' }}>No upcoming trains</td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </Box>
               </Box>
            </Box>
         </Paper>
      </Container>
   );
};

export default StationDetail;