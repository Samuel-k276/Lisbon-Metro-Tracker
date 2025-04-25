import React from 'react';
import { useParams } from 'react-router-dom';
import StationDetail from './StationDetail';

const StationDetailWrapper: React.FC = () => {
   const { stationId } = useParams<{ stationId: string }>();
   return stationId ? <StationDetail stationId={stationId} /> : <div>Station ID not found</div>;
};

export default StationDetailWrapper;