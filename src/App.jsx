import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { AppLayout } from './components/NavBar';
import { Explore } from './pages/Explore';
import { MyTrips } from './pages/MyTrips';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>     
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<AppLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/my-trips' element={<MyTrips />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
