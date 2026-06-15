import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página recargue
    if (email === 'admin@colegio.edu.pe' && password === 'admin123') {
      navigate('/dashboard'); // Redirige al dashboard
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center font-sans antialiased text-on-surface">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#c4c6cf_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      
      <main className="w-full max-w-md px-container-margin z-10 relative">
        <div className="bg-surface-container-lowest rounded-lg shadow-sm border border-outline-variant/30 overflow-hidden">
          
          <div className="p-stack-lg border-b border-outline-variant/30 text-center bg-primary-container text-on-primary">
            <h1 className="font-display-lg text-[32px] font-bold mb-stack-sm text-primary-fixed">CVScan Pro</h1>
            <p className="font-body-md text-[14px] text-on-primary-container">Colegio Fernando Belaunde Terry</p>
          </div>
          
          <div className="p-stack-lg">
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded text-sm font-body-sm">
                Credenciales incorrectas. Usa: admin@colegio.edu.pe / admin123
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-stack-md">
              <div>
                <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-stack-sm uppercase tracking-wider">
                  Correo Electrónico o Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">person</span>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-DEFAULT text-on-surface font-body-md text-[14px] focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest transition-colors" 
                    placeholder="admin@colegio.edu.pe" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-stack-sm uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-outline">lock</span>
                  </div>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-outline-variant/50 rounded-DEFAULT text-on-surface font-body-md text-[14px] focus:ring-2 focus:ring-primary outline-none bg-surface-container-lowest transition-colors" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              
              <div className="pt-stack-sm">
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-DEFAULT shadow-sm font-label-md text-[12px] font-bold text-on-primary bg-primary hover:bg-primary/90 transition-colors uppercase tracking-wider cursor-pointer">
                  Ingresar
                </button>
              </div>
            </form>
          </div>
          
          <div className="px-stack-lg py-stack-md bg-surface-container border-t border-outline-variant/30 text-center">
            <p className="font-body-sm text-[13px] text-on-surface-variant">
              <span className="material-symbols-outlined align-middle text-[16px] mr-1">security</span>
              Acceso restringido a personal autorizado.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-on-surface-variant/50 mt-4">Demo: admin@colegio.edu.pe / admin123</p>
      </main>
    </div>
  );
}