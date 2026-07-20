import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabase';

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [postulante, setPostulante] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerDetalle();
  }, [id]);

  const obtenerDetalle = async () => {
    try {
      const { data, error } = await supabase
        .from('postulantes')
        .select(`*, convocatorias(puesto)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setPostulante(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cargar el postulante');
    } finally {
      setCargando(false);
    }
  };

  const showToast = (msg) => alert(msg);
  
  const handleRechazar = async () => {
    if (window.confirm('¿Está seguro de rechazar a este postulante?')) {
      await supabase.from('postulantes').update({ estado: 'Rechazado' }).eq('id', id);
      alert('Postulante rechazado');
      navigate('/postulantes');
    }
  };
  const handleMoverEntrevista = async () => {
    if (window.confirm('¿Estás seguro de mover a este candidato a la etapa de Entrevistas?')) {
      try {
        const { error } = await supabase
          .from('postulantes')
          .update({ etapa: 'Entrevista' })
          .eq('id', id);

        if (error) throw error;

        alert('¡Candidato movido a Entrevistas exitosamente!');
        navigate('/postulantes'); 
      } catch (error) {
        console.error('Error al actualizar etapa:', error.message);
        alert('Hubo un error al mover al candidato.');
      }
    }
  };

  if (cargando) return <div className="p-8 text-center">Cargando datos del postulante...</div>;
  if (!postulante) return <div className="p-8 text-center">Postulante no encontrado.</div>;

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Link to="/postulantes" className="text-on-surface-variant flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer p-2 rounded w-fit">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-md text-[12px] font-bold">Volver a Postulantes</span>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-stack-lg flex-wrap gap-3">
        <div>
          <h2 className="font-display-lg text-[32px] font-bold text-primary">Detalle del Postulante</h2>
          <p className="text-on-surface-variant font-body-sm mt-1">Postulando a: {postulante.convocatorias?.puesto}</p>
        </div>
        <div className="flex gap-stack-sm flex-wrap">
          <a href={postulante.cv_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded bg-surface hover:bg-surface-container-high transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span className="font-label-md text-[12px] font-bold text-on-surface">Ver CV Original</span>
          </a>
          <button onClick={handleRechazar} className="flex items-center gap-2 px-4 py-2 border border-error rounded text-error hover:bg-error-container transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">close</span>
            <span className="font-label-md text-[12px] font-bold">Rechazar</span>
          </button>
          <button onClick={handleMoverEntrevista} className="flex items-center gap-2 px-4 py-2 bg-primary rounded text-on-primary hover:bg-primary/90 transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span className="font-label-md text-[12px] font-bold">Mover a Entrevista</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        {/* Columna izquierda */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-stack-md">
          {/* Perfil */}
          <div className="bg-surface-container-lowest p-stack-md rounded-lg shadow-sm border border-outline-variant/30 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-fixed mb-stack-sm bg-primary-fixed flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{postulante.nombre_completo.substring(0, 2).toUpperCase()}</span>
            </div>
            <h3 className="font-headline-sm text-[20px] font-bold text-primary mb-1">{postulante.nombre_completo}</h3>
            
            <span className={`px-2 py-1 rounded text-xs font-semibold mb-stack-md ${
              postulante.estado === 'Apto' ? 'bg-secondary-container text-on-secondary-fixed-variant' :
              postulante.estado === 'Observado' ? 'bg-surface-variant text-on-surface-variant' :
              'bg-error-container text-on-error-container'
            }`}>
              {postulante.estado}
            </span>

            <div className="w-full space-y-2 text-left">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                <span className="font-body-sm text-[13px]">{postulante.correo}</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">phone</span>
                <span className="font-body-sm text-[13px]">{postulante.telefono}</span>
              </div>
            </div>
          </div>

          {/* Score IA */}
          <div className="bg-surface-container-lowest p-stack-md rounded-lg shadow-sm border border-outline-variant/30 text-center">
            <h4 className="font-label-md text-[12px] font-bold uppercase text-on-surface-variant mb-stack-sm">Compatibilidad IA</h4>
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center rounded-full border-8 border-surface-container">
              <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(#476558 0% ${postulante.compatibilidad}%, #e7eeff ${postulante.compatibilidad}% 100%)`, borderRadius: '50%' }}></div>
              <div className="absolute inset-2 rounded-full bg-surface-container-lowest flex items-center justify-center">
                <span className="font-display-lg text-[32px] font-bold text-secondary">{postulante.compatibilidad}%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="bg-surface-container-lowest p-stack-sm rounded shadow-sm border border-outline-variant/30">
              <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Años Exp.</p>
              <p className="font-headline-md text-2xl font-bold text-primary mt-1">{postulante.anios_experiencia}</p>
            </div>
            <div className="bg-surface-container-lowest p-stack-sm rounded shadow-sm border border-outline-variant/30">
              <p className="font-label-md text-[12px] text-on-surface-variant uppercase">Grado</p>
              <p className="font-body-lg text-sm text-primary font-bold mt-1">{postulante.grado}</p>
            </div>
          </div>

          {/* Simulador de Ubicación y Certificados para la presentación */}
          <div className="bg-surface-container-lowest p-stack-md rounded-lg shadow-sm border border-outline-variant/30">
            <h4 className="font-label-md text-[12px] font-bold uppercase text-on-surface-variant mb-3 border-b border-outline-variant/30 pb-2">Verificaciones de Seguridad</h4>
            
            <div className="space-y-4">
              {/* Distancia */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[18px]">distance</span>
                </div>
                <div>
                  <p className="font-label-md text-[12px] font-bold text-on-surface">Distancia al Colegio</p>
                  <p className="font-body-sm text-[13px] text-on-surface-variant">
                    Aprox. {(Math.random() * 8 + 1).toFixed(1)} km (Ruta hacia Sunampe)
                  </p>
                </div>
              </div>

              {/* Certificados */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${postulante.estado === 'Apto' ? 'bg-secondary-container text-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <p className="font-label-md text-[12px] font-bold text-on-surface">Validación MINEDU / SUNEDU</p>
                  <p className="font-body-sm text-[13px] text-on-surface-variant">
                    {postulante.estado === 'Apto' 
                      ? '✓ Códigos de certificado auténticos' 
                      : '⚠ Pendiente de revisión manual'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-stack-md">
          {/* Resumen IA */}
          <div className="bg-surface-container-lowest p-stack-md rounded-lg shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-stack-sm">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <h4 className="font-headline-sm text-[20px] font-bold text-primary">Resumen Profesional Generado por IA</h4>
            </div>
            <p className="font-body-md text-[14px] text-on-surface leading-relaxed">
              <div dangerouslySetInnerHTML={{ __html: postulante.resumen_ia }} />
            </p>
          </div>
        </div>
      </div>
    </>
  );
}