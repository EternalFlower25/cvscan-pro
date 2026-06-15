import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Reportes() {
  const [estadisticas, setEstadisticas] = useState({
    aptosPorcentaje: 0,
    noAptosPorcentaje: 0,
    total: 0
  });

  useEffect(() => {
    calcularReportes();
  }, []);

  const calcularReportes = async () => {
    const { data } = await supabase.from('postulantes').select('estado');
    
    if (data && data.length > 0) {
      const aptos = data.filter(p => p.estado === 'Apto').length;
      const total = data.length;
      const porcentajeAptos = Math.round((aptos / total) * 100);
      
      setEstadisticas({
        aptosPorcentaje: porcentajeAptos,
        noAptosPorcentaje: 100 - porcentajeAptos,
        total: total
      });
    }
  };

  const showToast = (msg) => alert(msg);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-stack-lg">
        <div>
          <h2 className="font-display-lg text-[32px] font-bold text-on-surface">Reportes y Estadísticas</h2>
          <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Análisis integral del proceso de selección y reclutamiento.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => showToast('Generando PDF...')} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[18px] text-error">picture_as_pdf</span>
            <span className="font-label-md text-[12px] font-bold">Exportar PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {/* Pie chart Dinámico */}
        <div className="col-span-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg shadow-sm flex flex-col">
          <h3 className="font-headline-sm text-[20px] font-bold text-on-surface mb-stack-md">Efectividad del Filtrado</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div 
              className="relative w-48 h-48 rounded-full mb-6 transition-all duration-1000" 
              style={{ background: `conic-gradient(#476558 0% ${estadisticas.aptosPorcentaje}%, #ba1a1a ${estadisticas.aptosPorcentaje}% 100%)` }}
            ></div>
            <div className="w-full space-y-3 mt-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div><span className="font-body-md text-[14px] text-on-surface-variant">Aptos</span></div>
                <span className="font-data-mono text-[14px] font-bold text-on-surface">{estadisticas.aptosPorcentaje}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-error"></div><span className="font-body-md text-[14px] text-on-surface-variant">No Aptos / Observados</span></div>
                <span className="font-data-mono text-[14px] font-bold text-on-surface">{estadisticas.noAptosPorcentaje}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barras horizontales */}
        <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-lg shadow-sm">
          <div className="flex justify-between items-center mb-stack-lg">
            <h3 className="font-headline-sm text-[20px] font-bold text-on-surface">Métricas de Evaluación IA</h3>
          </div>
          <div className="space-y-5 mt-8">
            <p className="text-on-surface-variant text-sm mb-4">El motor de IA analiza los siguientes parámetros en cada documento subido al sistema ({estadisticas.total} procesados hasta ahora):</p>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-label-md text-[12px] font-bold text-on-surface">Precisión en Extracción de Textos (OCR)</span>
                <span className="font-data-mono text-[14px] text-on-surface-variant">98.5%</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2"><div className="bg-primary rounded-full h-2" style={{ width: '98.5%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-label-md text-[12px] font-bold text-on-surface">Validación de Certificados MINEDU</span>
                <span className="font-data-mono text-[14px] text-on-surface-variant">Fase Beta</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-2"><div className="bg-primary-fixed-dim rounded-full h-2" style={{ width: '60%' }}></div></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}