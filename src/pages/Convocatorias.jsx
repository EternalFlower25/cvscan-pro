import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase'; // Importamos el puente que creamos

export default function Convocatorias() {
  // Estados para guardar los datos y saber si está cargando
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Esto se ejecuta automáticamente cuando entras a la pantalla
  useEffect(() => {
    obtenerConvocatorias();
  }, []);

  const obtenerConvocatorias = async () => {
    try {
      // Pedimos todas las convocatorias ordenadas por la más reciente
      const { data, error } = await supabase
        .from('convocatorias')
        .select('*')
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;
      
      // Guardamos los datos en el estado de React
      setConvocatorias(data);
    } catch (error) {
      console.error('Error al obtener convocatorias:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const showToast = (msg) => {
    alert(msg); 
  };

  return (
    <>
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-display-lg text-[32px] font-bold text-on-surface">Gestión de Convocatorias</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Administre las vacantes activas y el historial de procesos de selección.</p>
        </div>
        <button onClick={() => showToast('Nueva vacante creada')} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded shadow-sm hover:bg-primary/90 transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="font-label-md text-[12px] font-bold">Nueva Vacante</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-surface-container-lowest p-4 rounded-lg shadow-sm border border-outline-variant/30 mb-stack-md flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:outline-none focus:border-primary font-body-sm text-[13px] bg-surface-bright" placeholder="Buscar por puesto o ID..."/>
        </div>
        <select className="border border-outline-variant rounded px-3 py-2 bg-surface-bright font-body-sm text-[13px] text-on-surface focus:outline-none">
          <option>Nivel: Todos</option><option>Primaria</option><option>Secundaria</option><option>Administrativo</option>
        </select>
        <select className="border border-outline-variant rounded px-3 py-2 bg-surface-bright font-body-sm text-[13px] text-on-surface focus:outline-none">
          <option>Estado: Todos</option><option>Abierta</option><option>Cerrada</option><option>En Evaluación</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="px-4 py-3 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Código</th>
              <th className="px-4 py-3 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Puesto</th>
              <th className="px-4 py-3 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Nivel</th>
              <th className="px-4 py-3 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Estado</th>
              <th className="px-4 py-3 font-label-md text-[12px] font-bold text-on-surface-variant uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {cargando ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant">
                  Cargando datos desde Supabase...
                </td>
              </tr>
            ) : convocatorias.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-on-surface-variant">
                  No hay convocatorias registradas.
                </td>
              </tr>
            ) : (
              // Aquí iteramos sobre los datos reales de la base de datos
              convocatorias.map((conv) => (
                <tr key={conv.id} className="hover:bg-inverse-on-surface/50 transition-colors h-[56px] group">
                  <td className="px-4 py-2 font-data-mono text-[14px] text-on-surface-variant">{conv.codigo}</td>
                  <td className="px-4 py-2 font-body-sm text-[13px] text-on-surface font-medium">{conv.puesto}</td>
                  <td className="px-4 py-2 font-body-sm text-[13px] text-on-surface-variant">{conv.nivel}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                      conv.estado === 'Abierta' ? 'bg-secondary-container text-on-secondary-fixed-variant' : 
                      conv.estado === 'En Evaluación' ? 'bg-primary-fixed text-on-primary-fixed-variant' : 
                      'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {conv.estado}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link to="/postulantes" title="Ver Postulantes" className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">group</span></Link>
                      <button onClick={() => showToast('Convocatoria editada')} title="Editar" className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                      <button onClick={() => showToast('Convocatoria cerrada')} title="Cerrar" className="text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[20px]">block</span></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}