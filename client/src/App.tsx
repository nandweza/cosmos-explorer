import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Planets from './pages/Planets';
import Missions from './pages/Missions';
import NEOTracker from './pages/NEOTracker';
import APOD from './pages/APOD';
import { useWebSocket } from './hooks/useWebSocket';
import { createContext, useContext } from 'react';
import type { LiveData } from './types';

interface AppContextType {
  liveData: LiveData;
  wsConnected: boolean;
}

export const AppContext = createContext<AppContextType>({ liveData: {}, wsConnected: false });
export const useAppContext = () => useContext(AppContext);

export default function App() {
  const { liveData, connected } = useWebSocket();

  return (
    <AppContext.Provider value={{ liveData, wsConnected: connected }}>
      <BrowserRouter>
        <div className="nebula-bg" />
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planets" element={<Planets />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/neo" element={<NEOTracker />} />
          <Route path="/apod" element={<APOD />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
