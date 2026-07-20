import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Entrevistas() {
  const [entrevistados, setEntrevistados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerEntrevistados();
  }, []);

  const obtenerEntrevistados = async () => {
    try {
      const { data, error } = await supabase
        .from('postulantes')
        .select(`*, convocatorias(puesto)`)
        .eq('etapa', 'Entrevista') // FILTRO MAGISTRAL: Solo trae los de esta etapa
        .order('fecha_postulacion', { ascending: false });

      if (error) throw error;
      setEntrevistados(data || []);
    } catch (error) {
      console.error('Error al cargar entrevistas:', error);
    } finally {
      setCargando(false);
    }
  };

  // Función para cerrar el proceso del candidato
  const finalizarProceso = async (id, resolucion) => {
    const accion = resolucion === 'Contratado' ? 'contratar' : 'rechazar';
    if (!window.confirm(`¿Estás seguro de ${accion} a este candidato de forma definitiva?`)) return;

    try {
      const { error } = await supabase
        .from('postulantes')
        .update({ 
          estado: resolucion, 
          etapa: 'Finalizado' // Lo sacamos de la pantalla de entrevistas
        })
        .eq('id', id);

      if (error) throw error;
      
      // Recargar la lista para que desaparezca la tarjeta mágicamente
      obtenerEntrevistados(); 
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Hubo un error al procesar al candidato.');
    }
  };

  // Agrupamos por puesto de trabajo
  const agrupados = entrevistados.reduce((grupos, postulante) => {
    const puesto = postulante.convocatorias?.puesto || 'Sin Vacante Asignada';
    if (!grupos[puesto]) grupos[puesto] = [];
    grupos[puesto].push(postulante);
    return grupos;
  }, {});

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex justify-between items-end pb-2 border-b border-outline-variant/30">
        <div>
          <p className="font-label-md text-[12px] font-bold text-outline mb-1 uppercase tracking-wider">Módulo de Seguimiento</p>
          <h2 className="font-headline-md text-[24px] font-bold text-on-surface">Panel de Entrevistas</h2>
        </div>
      </div>

      {cargando ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">Cargando agenda de entrevistas...</div>
      ) : entrevistados.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[48px] text-outline mb-4 block">event_available</span>
          No hay entrevistas pendientes en este momento.
        </div>
      ) : (
        Object.entries(agrupados).map(([puesto, candidatos]) => (
          <div key={puesto} className="flex flex-col gap-4">
            
            <div className="flex items-center gap-2 border-b border-outline-variant/50 pb-2">
              <span className="material-symbols-outlined text-primary text-[20px]">work</span>
              <h3 className="font-headline-sm text-[18px] font-bold text-on-surface">{puesto}</h3>
              <span className="bg-primary text-on-primary px-2.5 py-0.5 rounded-full text-[12px] font-bold ml-2">
                {candidatos.length}
              </span>
            </div>

            {/* Grid de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {candidatos.map(candidato => (
                <div key={candidato.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between hover:border-primary/50 transition-colors relative overflow-hidden">
                  
                  {/* Borde superior decorativo */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-[16px] text-on-surface">{candidato.nombre_completo}</h4>
                        <span className="text-[12px] font-bold text-secondary bg-secondary-container/30 px-2 py-0.5 rounded">
                          IA Score: {candidato.compatibilidad}%
                        </span>
                      </div>
                      <a href={candidato.cv_url} target="_blank" rel="noreferrer" title="Ver CV" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined text-[18px]">description</span>
                      </a>
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        <span className="font-body-sm text-[13px]">{candidato.correo}</span>
                      </div>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">phone</span>
                        <span className="font-body-sm text-[13px]">{candidato.telefono}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de Acción Rápida */}
                  <div className="flex gap-2 border-t border-outline-variant/30 pt-4 mt-auto">
                    <button 
                      onClick={() => finalizarProceso(candidato.id, 'Rechazado')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-error text-error rounded-md hover:bg-error-container hover:border-error-container transition-colors font-bold text-[12px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span> Rechazar
                    </button>
                    <button 
                      onClick={() => finalizarProceso(candidato.id, 'Contratado')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-bold text-[12px]"
                    >
                      <span className="material-symbols-outlined text-[16px]">how_to_reg</span> Contratar
                    </button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}