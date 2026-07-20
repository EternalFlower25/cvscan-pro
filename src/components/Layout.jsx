import { Link, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/convocatorias', icon: 'work', label: 'Convocatorias' },
    { path: '/postulantes', icon: 'groups', label: 'Postulantes' },
    { path: '/entrevistas', icon: 'forum', label: 'Entrevistas' },
    { path: '/reportes', icon: 'assessment', label: 'Reportes' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md text-on-surface">
      {/* Sidebar */}
      <nav className="fixed left-0 top-0 h-full w-sidebar-width bg-primary shadow-sm flex flex-col py-container-margin z-20">
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">school</span>
          </div>
          <div>
            <h1 className="font-headline-md text-[24px] font-bold text-primary-fixed">CVScan Pro</h1>
            <p className="font-label-md text-[12px] text-on-primary-container">Administración HR</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-body-md text-[14px] transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-fixed-variant/20 border-l-4 border-primary-fixed text-primary-fixed'
                  : 'text-on-primary-container/70 hover:bg-white/10 hover:text-primary-fixed'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span> {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto px-3">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-on-primary-container/70 hover:bg-white/10 hover:text-primary-fixed transition-colors font-body-md text-[14px] border-t border-white/10 pt-4">
            <span className="material-symbols-outlined">logout</span> Cerrar Sesión
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-sidebar-width flex flex-col h-screen overflow-hidden">
        {/* TopBar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant/30 flex justify-between items-center h-16 px-container-margin z-10 shrink-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-primary font-body-md text-[14px] outline-none" placeholder="Buscar postulantes, convocatorias..."/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">A</div>
          </div>
        </header>

        {/* Dynamic Page Content (Aquí renderizará el Dashboard, etc.) */}
        <main className="flex-1 overflow-y-auto p-container-margin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}