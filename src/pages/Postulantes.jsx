import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Postulantes() {
  const [postulantes, setPostulantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    obtenerPostulantes();
  }, []);

  const obtenerPostulantes = async () => {
    try {
      const { data, error } = await supabase
        .from('postulantes')
        .select(`*, convocatorias (puesto)`)
        .order('fecha_postulacion', { ascending: false });

      if (error) throw error;
      setPostulantes(data || []);
    } catch (error) {
      console.error('Error al obtener postulantes:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleCargaClick = () => fileInputRef.current.click();

  const subirCV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setSubiendo(true);
      
      // 1. Subida a Supabase Storage
      const filePath = `cv_docs/${Math.random()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('cvx').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('cvx').getPublicUrl(filePath);

      // 2. SIMULACIÓN DE IA (Mantener esto hasta tener la IA real conectada)
      const compatibilidad = Math.floor(Math.random() * 30) + 70;
      await supabase.from('postulantes').insert([{
        convocatoria_id: 1,
        nombre_completo: 'Postulante Simulador',
        correo: 'test@email.com',
        compatibilidad: compatibilidad,
        grado: 'Licenciado',
        resumen_ia: 'Profesional con experiencia docente.',
        estado: compatibilidad >= 85 ? 'Apto' : 'Observado',
        cv_url: urlData.publicUrl
      }]);

      alert('¡CV procesado y añadido exitosamente!');
      obtenerPostulantes();
      event.target.value = null;
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-stack-lg">
      <div className="flex justify-between items-end pb-2 border-b border-outline-variant/30">
        <div>
          <p className="font-label-md text-[12px] font-bold text-outline mb-1 uppercase tracking-wider">Módulo de Selección</p>
          <h2 className="font-headline-md text-[24px] font-bold text-on-surface">Todos los Postulantes Registrados</h2>
        </div>
        <div className="flex gap-3">
          <Link to="/nuevo-postulante" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[12px] font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Postulante
          </Link>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 xl:col-span-3 h-full">
          <input type="file" accept=".pdf" ref={fileInputRef} onChange={subirCV} className="hidden" />
          <div onClick={subiendo ? null : handleCargaClick} className={`bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl p-6 h-full flex flex-col justify-center items-center cursor-pointer ${subiendo ? 'opacity-50' : 'hover:bg-surface-container-low'}`}>
            <span className="material-symbols-outlined text-primary text-[28px] mb-4">{subiendo ? 'sync' : 'cloud_upload'}</span>
            <h3 className="font-bold text-sm">Carga Masiva de CVs</h3>
          </div>
        </div>

        <div className="col-span-12 xl:col-span-9">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/50">
                <tr>
                  <th className="py-3 px-4 font-bold text-[12px] uppercase">Candidato</th>
                  <th className="py-3 px-4 font-bold text-[12px] uppercase">Puesto</th>
                  <th className="py-3 px-4 font-bold text-[12px] uppercase">Compatibilidad</th>
                  <th className="py-3 px-4 font-bold text-[12px] uppercase">Estado</th>
                  <th className="py-3 px-4 font-bold text-[12px] uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {postulantes.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-high transition-colors">
                    <td className="py-2 px-4">{post.nombre_completo}</td>
                    <td className="py-2 px-4">{post.convocatorias?.puesto || 'N/A'}</td>
                    <td className="py-2 px-4">{post.compatibilidad}%</td>
                    <td className="py-2 px-4">{post.estado}</td>
                    <td className="py-2 px-4 text-right">
                      <Link to={`/detalle/${post.id}`} className="text-primary font-bold text-[12px]">Ver Detalle</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}