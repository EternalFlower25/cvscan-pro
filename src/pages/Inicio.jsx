import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <div className="bg-background min-h-screen font-sans antialiased text-on-surface">
      {/* Navbar de la Landing */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/30 h-16 px-container-margin flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-fixed text-sm">school</span>
          </div>
          <span className="font-headline-md text-xl font-black text-primary">CVScan Pro</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#caracteristicas" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Características</a>
          <a href="#precios" className="font-body-sm text-on-surface-variant hover:text-primary transition-colors">Planes</a>
          <Link to="/login" className="bg-primary text-on-primary px-4 py-2 rounded font-label-md text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">
            Ingresar al Sistema
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-container-margin text-center overflow-hidden bg-surface-container-low">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(#c4c6cf_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed-variant font-label-md text-[11px] uppercase tracking-wide">
            Diseñado para Instituciones Educativas
          </span >
          <h1 className="font-display-lg text-4xl md:text-5xl font-black text-primary tracking-tight">
            Optimiza la selección de docentes con Inteligencia Artificial
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl mx-auto">
            CVScan Pro analiza, filtra y califica los currículums presentados en tu escuela en segundos, garantizando la contratación del mejor talento pedagógico de forma transparente.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <a href="#precios" className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-sm uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm">
              Ver Planes
            </a>
            <Link to="/login" className="bg-surface text-primary border border-outline-variant px-6 py-3 rounded-lg font-label-md text-sm uppercase tracking-wider hover:bg-surface-container transition-all shadow-sm flex items-center gap-2">
              Solicitar Demo <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Características */}
      <section id="caracteristicas" className="py-16 px-container-margin max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-md text-2xl font-bold text-primary">¿En qué ayuda CVScan Pro?</h2>
          <p className="font-body-md text-on-surface-variant mt-2">Herramientas automatizadas para el departamento de Recursos Humanos de tu escuela.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined">psychology</span>
            </div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Análisis de Perfil por IA</h3>
            <p className="font-body-sm text-on-surface-variant">Extrae automáticamente experiencia relevante, grados académicos y competencias clave directamente desde los archivos PDF.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined">verified</span>
            </div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Validación de Certificados</h3>
            <p className="font-body-sm text-on-surface-variant">Próxima integración para escanear y autenticar códigos de capacitaciones docentes, asegurando la veracidad de los documentos presentados.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 p-6 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary mb-4">
              <span className="material-symbols-outlined">distance</span>
            </div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-2">Filtro de Ubicación</h3>
            <p className="font-body-sm text-on-surface-variant">Módulo en desarrollo para calcular la cercanía del domicilio del postulante respecto a la institución educativa para garantizar puntualidad.</p>
          </div>
        </div>
      </section>

      {/* Tabla de Precios */}
      <section id="precios" className="py-16 bg-surface-container-low px-container-margin">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-md text-2xl font-bold text-primary">Planes diseñados para cada escuela</h2>
            <p className="font-body-md text-on-surface-variant mt-2">Invierte en la mejor tecnología para tu proceso de contratación.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-8">
            {/* Plan Mensual */}
            <div className="bg-surface-container-lowest border border-outline-variant/50 p-8 rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface">Plan Mensual</h3>
                <p className="font-body-sm text-on-surface-variant mt-1">Flexibilidad para procesos de selección cortos o estacionales.</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-primary">S/ 200</span>
                  <span className="text-on-surface-variant text-sm"> / mes</span>
                </div>
                <ul className="space-y-3 font-body-sm text-on-surface-variant border-t border-outline-variant/30 pt-4">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Análisis de CVs con IA Avanzada</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Validación de Certificados</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Filtro de Ubicación</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Soporte técnico en horario laboral</li>
                </ul>
              </div>
              <Link to="/login" className="w-full mt-8 bg-surface-container text-primary border border-outline-variant rounded-md py-2 text-center font-label-md text-xs uppercase tracking-wider hover:bg-surface-container-high transition-colors">
                Elegir Plan Mensual
              </Link>
            </div>

            {/* Plan Anual */}
            <div className="bg-surface-container-lowest border-2 border-primary p-8 rounded-xl shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-primary text-on-primary px-3 py-0.5 rounded-full font-label-md text-[10px] uppercase tracking-wide">Ahorra S/ 400</span>
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-primary">Plan Anual</h3>
                <p className="font-body-sm text-on-surface-variant mt-1">La opción más rentable para cubrir todo el año escolar.</p>
                <div className="my-6">
                  <span className="text-3xl font-black text-primary">S/ 2000</span>
                  <span className="text-on-surface-variant text-sm"> / año</span>
                </div>
                <ul className="space-y-3 font-body-sm text-on-surface-variant border-t border-outline-variant/30 pt-4">
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> <strong>Todo lo del plan mensual</strong></li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Carga masiva ilimitada</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Reportes históricos exportables</li>
                  <li className="flex items-center gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Soporte técnico prioritario 24/7</li>
                </ul>
              </div>
              <Link to="/login" className="w-full mt-8 bg-primary text-on-primary rounded-md py-2 text-center font-label-md text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors">
                Elegir Plan Anual
              </Link>
            </div>
          </div>

          {/* Banner de Demo */}
          <div className="bg-primary-container border border-primary/30 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-primary-container">¿Deseas ver CVScan Pro en acción?</h3>
              <p className="font-body-sm text-on-primary-container/80 mt-1">Solicita una demostración funcional gratuita. Evalúa el poder de nuestra IA leyendo certificados y calculando ubicaciones antes de tomar una decisión.</p>
            </div>
            <Link to="/login" className="shrink-0 bg-primary text-on-primary px-6 py-2 rounded-lg font-label-md text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-sm">
              Solicitar Demo
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-primary text-primary-fixed-dim text-xs font-body-sm border-t border-white/10">
        &copy; 2026 CVScan Pro. Todos los derechos reservados. Diseñado para la optimización de Recursos Humanos en colegios.
      </footer>
    </div>
  );
}