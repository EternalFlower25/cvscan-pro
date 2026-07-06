import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function NuevaConvocatoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    puesto: '',
    descripcion: '',
    estado: 'Abierta'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('convocatorias').insert([formData]);

    if (error) {
      alert('Error al crear la vacante: ' + error.message);
    } else {
      alert('Vacante creada con éxito');
      navigate('/convocatorias');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-surface-container-lowest rounded-xl border border-outline-variant">
      <h2 className="text-2xl font-bold text-primary mb-6">Crear Nueva Vacante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Nombre del Puesto (ej. Profesor de Matemáticas)" required 
          onChange={(e) => setFormData({...formData, puesto: e.target.value})} />
        
        <textarea className="w-full p-2 border rounded h-32" placeholder="Descripción breve del puesto..." required 
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />

        <button type="submit" className="w-full bg-primary text-on-primary py-2 rounded font-bold">
          Publicar Vacante
        </button>
      </form>
    </div>
  );
}