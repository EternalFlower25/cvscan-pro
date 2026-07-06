import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export default function NuevaConvocatoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    puesto: '',
    nivel: 'Secundaria', // Valor por defecto
    descripcion: '',
    estado: 'Abierta'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.from('convocatorias').insert([formData]);

      if (error) throw error;
      
      alert('Vacante creada con éxito');
      navigate('/convocatorias');
    } catch (error) {
      console.error(error);
      alert('Error al crear la vacante: ' + error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm">
      <h2 className="text-2xl font-bold text-primary mb-6">Crear Nueva Vacante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Código</label>
            <input className="w-full p-2 border border-outline-variant rounded focus:outline-none focus:border-primary" 
              placeholder="Ej. MAT-001" required 
              onChange={(e) => setFormData({...formData, codigo: e.target.value})} />
          </div>
          <div>
            <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Nivel</label>
            <select className="w-full p-2 border border-outline-variant rounded focus:outline-none focus:border-primary" required
              onChange={(e) => setFormData({...formData, nivel: e.target.value})}>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria" selected>Secundaria</option>
              <option value="Administrativo">Administrativo</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Nombre del Puesto</label>
          <input className="w-full p-2 border border-outline-variant rounded focus:outline-none focus:border-primary" 
            placeholder="Ej. Profesor de Matemáticas" required 
            onChange={(e) => setFormData({...formData, puesto: e.target.value})} />
        </div>
        
        <div>
          <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Descripción y Requisitos</label>
          <textarea className="w-full p-2 border border-outline-variant rounded h-32 focus:outline-none focus:border-primary" 
            placeholder="Describa el perfil buscado..." required 
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
        </div>

        <button type="submit" className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors mt-4">
          Publicar Vacante
        </button>
      </form>
    </div>
  );
}