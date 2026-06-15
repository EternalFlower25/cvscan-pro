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
      setPostulantes(data);
    } catch (error) {
      console.error('Error al obtener postulantes:', error.message);
    } finally {
      setCargando(false);
    }
  };

  const showToast = (msg) => {
    alert(msg);
  };

  const handleCargaClick = () => {
    fileInputRef.current.click();
  };

  const subirCV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showToast('Por favor, sube un archivo PDF válido.');
      return;
    }

    try {
      setSubiendo(true);
      showToast('1. Subiendo CV a la nube...');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `cv_docs/${fileName}`;

      // 1. Subir al bucket 'cvx'
      const { error: uploadError } = await supabase.storage
        .from('cvx')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública del archivo que acabamos de subir
      const { data: urlData } = supabase.storage
        .from('cvx')
        .getPublicUrl(filePath);
      
      const cvUrlReal = urlData.publicUrl;

      showToast('2. Analizando perfil con IA...');

      // 3. SIMULACIÓN DE IA (Para tu prototipo funcional del 60%)
      const nombresFicticios = ['Lic. Carlos Mendoza', 'Ing. Diana Flores', 'Dra. Elena Beltrán', 'Prof. Javier Soto'];
      const gradosFicticios = ['Licenciado', 'Magíster', 'Bachiller'];
      const resúmenesFicticios = [
        'Especialista en gestión escolar con sólida experiencia en innovación pedagógica y metodologías activas.',
        'Profesional con fuerte enfoque en tutoría y desarrollo socioemocional de estudiantes de nivel secundaria.',
        'Docente con dominio avanzado de herramientas digitales para la educación a distancia y gamificación en el aula.'
      ];

      const nombreSimulado = nombresFicticios[Math.floor(Math.random() * nombresFicticios.length)];
      const gradoSimulado = gradosFicticios[Math.floor(Math.random() * gradosFicticios.length)];
      const resumenSimulado = resúmenesFicticios[Math.floor(Math.random() * resúmenesFicticios.length)];
      const compatibilidadSimulada = Math.floor(Math.random() * (98 - 70 + 1)) + 70;

      showToast('3. Guardando resultados en la base de datos...');

      // 4. Insertar la fila en la tabla de 'postulantes'
      const { error: insertError } = await supabase
        .from('postulantes')
        .insert([
          {
            convocatoria_id: 1, 
            nombre_completo: nombreSimulado,
            correo: `${nombreSimulado.toLowerCase().replace(/[^a-z]/g, '')}@email.com`,
            telefono: '+51 9' + Math.floor(10000000 + Math.random() * 90000000),
            compatibilidad: compatibilidadSimulada,
            grado: gradoSimulado,
            anios_experiencia: Math.floor(Math.random() * 12) + 1,
            resumen_ia: resumenSimulado,
            estado: compatibilidadSimulada >= 85 ? 'Apto' : 'Observado',
            cv_url: cvUrlReal
          }
        ]);

      if (insertError) throw insertError;

      showToast('¡Proceso completado! Postulante analizado y registrado.');
      
      // 5. Refrescar la tabla al instante
      obtenerPostulantes();
      
      event.target.value = null;

    } catch (error) {
      console.error('Error en el flujo:', error);
      showToast('Hubo un error: ' + error.message);
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
          <button onClick={() => showToast('Exportando datos...')} className="px-4 py-2 bg-surface text-primary border border-outline-variant rounded-lg font-label-md text-[12px] font-bold shadow-sm hover:bg-surface-container transition-colors flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">download</span> Exportar
          </button>
          <button onClick={() => showToast('Formulario de nuevo postulante')} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-[12px] font-bold shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">add</span> Nuevo Postulante
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Zona de Carga Masiva */}
        <div className="col-span-12 xl:col-span-3 h-full">
          <input 
            type="file" 
            accept=".pdf" 
            ref={fileInputRef} 
            onChange={subirCV} 
            className="hidden" 
          />
          
          <div 
            onClick={subiendo ? null : handleCargaClick} 
            className={`bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl shadow-sm p-6 h-full flex flex-col justify-center items-center text-center transition-colors group ${subiendo ? 'opacity-50 cursor-wait' : 'hover:bg-surface-container-low cursor-pointer'}`} 
            style={{ minHeight: '180px' }}
          >
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {subiendo ? (
                <span className="material-symbols-outlined text-primary text-[28px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-primary text-[28px]">cloud_upload</span>
              )}
            </div>
            <h3 className="font-label-md text-[12px] font-bold text-on-surface mb-2">
              {subiendo ? 'Procesando...' : 'Carga Masiva de CVs'}
            </h3>
            <p className="font-body-sm text-[13px] text-outline px-4">
              {subiendo ? 'Por favor espera un momento.' : 'Arrastra archivos PDF aquí, o haz clic para explorar.'}
            </p>
            <span className="mt-4 px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-full font-label-md text-[10px] uppercase">
              Límite 50 archivos
            </span>
          </div>
        </div>

        {/* Tabla Dinámica */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-stack-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-outline-variant/30">
              <span className="material-symbols-outlined text-outline">tune</span>
              <span className="font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Filtros</span>
            </div>
            <span className="font-body-sm text-outline ml-auto">{postulantes.length} resultados encontrados</span>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/50">
                <tr>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Candidato</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Puesto Vacante</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Compatibilidad</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Grado</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Estado</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {cargando ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-on-surface-variant">
                      Cargando postulantes...
                    </td>
                  </tr>
                ) : postulantes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-on-surface-variant">
                      No hay postulantes registrados en este momento.
                    </td>
                  </tr>
                ) : (
                  postulantes.map((post) => (
                    <tr key={post.id} className="h-[56px] hover:bg-surface-container-high transition-colors bg-surface-container-lowest">
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary font-label-md font-bold">
                            {post.nombre_completo.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-data-mono text-[14px] text-on-surface font-semibold">{post.nombre_completo}</span>
                        </div>
                      </td>
                      <td className="py-2 px-4 font-body-sm text-[13px] text-on-surface-variant">
                        {post.convocatorias?.puesto || 'No asignado'}
                      </td>
                      <td className="py-2 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <span className="font-data-mono text-[14px] font-bold text-on-surface">{post.compatibilidad}%</span>
                          <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${post.compatibilidad}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 font-body-sm text-[13px] text-on-surface-variant">{post.grado}</td>
                      <td className="py-2 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          post.estado === 'Apto' ? 'bg-secondary-container text-on-secondary-fixed-variant border-secondary-fixed' :
                          post.estado === 'Observado' ? 'bg-surface-variant text-on-surface-variant border-outline-variant' :
                          'bg-error-container text-on-error-container border-error'
                        }`}>
                          {post.estado}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Link to={`/detalle/${post.id}`} className="text-primary hover:text-primary/80 font-label-md text-[12px] font-bold transition-colors flex items-center justify-end gap-1 ml-auto">
                        Ver Detalle <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}