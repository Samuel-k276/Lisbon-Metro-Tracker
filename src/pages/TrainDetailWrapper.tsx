import React from 'react';
import { useParams } from 'react-router-dom';
import TrainDetail from './TrainDetail';

const TrainDetailWrapper: React.FC = () => {
   const { trainId } = useParams<{ trainId: string }>();
   return trainId ? <TrainDetail trainId={trainId} /> : <div>Train ID not found</div>;
};

export default TrainDetailWrapper;