import React from 'react';
import { WeddingCard } from './components/WeddingCard';
import { gulCardConfig } from './data/cards/gul';
import './styles/global.css';

export const App: React.FC = () => {
  return <WeddingCard initialConfig={gulCardConfig} />;
};

export default App;
