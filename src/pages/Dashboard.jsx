import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function Dashboard() {
  const [metricas, setMetricas] = useState({
    total: 0,
    aptos: 0,
    vacantes: 0
  });

  useEffect(() => {
    cargarMetricas();
  }, []);

  const cargarMetricas = async () => {
    // Contamos total de postulantes
    const { count: totalCVs } = await supabase
      .from('postulantes')
      .select('*', { count: 'exact', head: true });

    // Contamos cuantos son aptos
    const { count: totalAptos } = await supabase
      .from('postulantes')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'Apto');

    // Contamos vacantes activas
    const { count: totalVacantes } = await supabase
      .from('convocatorias')
      .select('*', { count: 'exact', head: true })
      .eq('estado', 'Abierta');

    setMetricas({
      total: totalCVs || 0,
      aptos: totalAptos || 0,
      vacantes: totalVacantes || 0
    });
  };

  return (
    <>
      <div className="mb-stack-lg">
        <h2 className="font-headline-md text-[24px] font-bold text-on-surface">Bienvenido, Administrador</h2>
        <p className="font-body-md text-[14px] text-on-surface-variant mt-1">Resumen general del proceso de reclutamiento y selección en tiempo real.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-gutter mb-stack-lg">
        <MetricCard title="CVs Recibidos" value={metricas.total} icon="description" trend="Base de datos en vivo" />
        <MetricCard title="Analizados por IA" value={metricas.total} icon="psychology" trend="100% tasa de proc." />
        <MetricCard title="Postulantes Aptos" value={metricas.aptos} icon="check_circle" trend="Alta compatibilidad" isSuccess />
        <MetricCard title="Vacantes Activas" value={metricas.vacantes} icon="work" trend="Convocatorias abiertas" isInfo />
        
        <div className="bg-primary-container text-on-primary-container rounded-xl p-4 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-10">
            <span className="material-symbols-outlined text-[100px]">timer</span>
          </div>
          <div className="flex items-start justify-between mb-2 relative z-10">
            <span className="font-label-md text-[12px] font-bold text-primary-fixed uppercase">Tiempo Ahorrado</span>
          </div>
          <div className="relative z-10">
            <div className="font-display-lg text-[32px] font-bold text-on-primary">{metricas.total * 2}h</div>
            <div className="flex items-center gap-1 mt-1 text-primary-fixed-dim">
              <span className="font-body-sm text-[13px]">Estimado (2h por CV)</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden p-6 text-center">
         <h3 className="text-xl font-bold mb-4 text-primary">Sistema conectado y operando</h3>
         <p className="text-on-surface-variant">Sube un nuevo archivo PDF en la pestaña de Postulantes y vuelve aquí. Verás que los números se actualizan de forma automática.</p>
      </div>
    </>
  );
}

function MetricCard({ title, value, icon, trend, isSuccess, isInfo }) {
  const iconBg = isSuccess ? 'bg-secondary-container text-on-secondary-container' 
               : isInfo ? 'bg-primary-fixed text-on-primary-fixed' 
               : 'bg-surface-container text-primary';

  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/50 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-2">
        <span className="font-label-md text-[12px] font-bold text-on-surface-variant uppercase">{title}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
          <span className="material-symbols-outlined text-[18px]">{icon}</span>
        </div>
      </div>
      <div>
        <div className="font-display-lg text-[32px] font-bold text-on-surface">{value}</div>
        <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
          <span className="font-body-sm text-[13px]">{trend}</span>
        </div>
      </div>
    </div>
  );
}