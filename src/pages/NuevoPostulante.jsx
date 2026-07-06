import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function NuevoPostulante() {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargandoConvocatorias, setCargandoConvocatorias] = useState(true);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    correo: '',
    telefono: '',
    convocatoria_id: '',
    grado: 'Licenciado'
  });

  useEffect(() => {
    const cargarConvocatorias = async () => {
      setCargandoConvocatorias(true);
      const { data } = await supabase.from('convocatorias').select('id, puesto').eq('estado', 'Abierta');
      setConvocatorias(data || []);
      setCargandoConvocatorias(false);
    };
    cargarConvocatorias();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.from('postulantes').insert([formData]);

    if (error) {
      alert('Error al guardar: ' + error.message);
    } else {
      alert('Postulante registrado con éxito');
      navigate('/postulantes');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
      <h2 className="text-2xl font-bold text-primary mb-6">Registrar Nuevo Postulante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Nombre Completo" required 
          onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})} />
        
        <input className="w-full p-2 border rounded" type="email" placeholder="Correo Electrónico" required 
          onChange={(e) => setFormData({...formData, correo: e.target.value})} />
        
        <input className="w-full p-2 border rounded" placeholder="Teléfono" 
          onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
        
        {/* Aquí está el select único y funcional */}
        <select 
          className="w-full p-2 border rounded" 
          required 
          disabled={cargandoConvocatorias}
          onChange={(e) => setFormData({...formData, convocatoria_id: e.target.value})}
        >
          <option value="">{cargandoConvocatorias ? 'Cargando puestos...' : 'Seleccione el puesto...'}</option>
          {convocatorias.map(c => <option key={c.id} value={c.id}>{c.puesto}</option>)}
        </select>

        <button type="submit" className="w-full bg-primary text-on-primary py-2 rounded font-bold hover:bg-primary/90 transition-colors">
          Guardar Postulante
        </button>
      </form>
    </div>
  );
}