import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Convocatorias from './pages/Convocatorias';
import Postulantes from './pages/Postulantes';
import Reportes from './pages/Reportes';
import Detalle from './pages/Detalle';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Privadas (dentro del Layout con el menú) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/convocatorias" element={<Convocatorias />} />
          <Route path="/postulantes" element={<Postulantes />} />
          <Route path="/reportes" element={<Reportes />} />
          {/* Aquí está la ruta corregida para aceptar el ID del postulante */}
          <Route path="/detalle/:id" element={<Detalle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;