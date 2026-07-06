import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Postulantes() {
  const [postulantes, setPostulantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [estadoIA, setEstadoIA] = useState('Carga Masiva de CVs');
  
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

  const handleCargaClick = () => {
    if (!subiendo) fileInputRef.current.click();
  };

  // --- EL CEREBRO DE TU APLICACIÓN ---
  const procesarConIA = async (base64Data) => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      // Instrucciones estrictas para que la IA actúe como reclutador
      const prompt = `Eres un sistema experto de Recursos Humanos. Analiza este CV en formato PDF. 
      Extrae la información y devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta, sin formato markdown ni texto extra:
      {
        "nombre_completo": "Nombre y apellidos del candidato",
        "grado": "Ej: Bachiller, Licenciado, Magister, Técnico, etc. (El más alto que encuentres)",
        "compatibilidad": un número entero del 0 al 100 evaluando qué tan completo y profesional es el CV,
        "resumen": "Un resumen profesional de máximo 2 líneas",
        "estado": "Apto" (si compatibilidad >= 80) o "Observado" (si es menor a 80)
      }`;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'application/pdf'
          }
        }
      ]);

      // Limpiamos la respuesta para asegurarnos de que sea un JSON puro
      let textoRespuesta = result.response.text();
      textoRespuesta = textoRespuesta.replace(/```json/g, '').replace(/```/g, '').trim();
      
      return JSON.parse(textoRespuesta);
    } catch (error) {
      console.error("Error en IA:", error);
      throw new Error("La IA no pudo procesar la información de este documento.");
    }
  };

  const subirCV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Por favor, sube un archivo PDF válido.');
      return;
    }

    try {
      setSubiendo(true);
      
      // 1. Leer el PDF
      setEstadoIA('Leyendo PDF...');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          // Extraemos el código del archivo
          const base64Data = reader.result.split(',')[1];
          
          // 2. Extraer datos con IA
          setEstadoIA('IA Analizando Perfil...');
          const datosIA = await procesarConIA(base64Data);

          // 3. Subir el PDF físico a tu base de datos
          setEstadoIA('Guardando en la Nube...');
          const filePath = `cv_docs/${Math.random().toString(36).substring(7)}-${file.name}`;
          const { error: uploadError } = await supabase.storage.from('cvx').upload(filePath, file);
          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage.from('cvx').getPublicUrl(filePath);

          // 4. Guardar los datos extraídos en la tabla
          setEstadoIA('Registrando Postulante...');
          const { error: insertError } = await supabase.from('postulantes').insert([{
            convocatoria_id: 1, // ID fijo por ahora
            nombre_completo: datosIA.nombre_completo || 'Candidato Desconocido',
            correo: 'extraido-por-ia@email.com', 
            compatibilidad: datosIA.compatibilidad || 70,
            grado: datosIA.grado || 'No especificado',
            resumen_ia: datosIA.resumen || 'Sin resumen disponible.',
            estado: datosIA.estado || 'Observado',
            cv_url: urlData.publicUrl
          }]);

          if (insertError) throw insertError;

          alert('¡Candidato analizado por IA y registrado con éxito!');
          obtenerPostulantes();
          
        } catch (err) {
          console.error(err);
          alert('Error en el flujo: ' + err.message);
        } finally {
          setSubiendo(false);
          setEstadoIA('Carga Masiva de CVs');
          event.target.value = null; 
        }
      };

    } catch (error) {
      console.error(error);
      alert('Error crítico: ' + error.message);
      setSubiendo(false);
      setEstadoIA('Carga Masiva de CVs');
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

      <div className="grid grid-cols-12 gap-gutter">
        {/* Zona de Carga Inteligente */}
        <div className="col-span-12 xl:col-span-3 h-full">
          <input type="file" accept=".pdf" ref={fileInputRef} onChange={subirCV} className="hidden" />
          <div 
            onClick={handleCargaClick} 
            className={`bg-surface-container-lowest border-2 border-dashed border-outline-variant rounded-xl p-6 h-full flex flex-col justify-center items-center text-center transition-colors group ${subiendo ? 'opacity-80 cursor-wait bg-surface-container-low' : 'hover:bg-surface-container-low cursor-pointer'}`}
            style={{ minHeight: '180px' }}
          >
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              {subiendo ? (
                <span className="material-symbols-outlined text-primary text-[28px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-primary text-[28px]">auto_awesome</span>
              )}
            </div>
            <h3 className="font-label-md text-[12px] font-bold text-on-surface mb-2">{estadoIA}</h3>
            <p className="font-body-sm text-[13px] text-outline px-4">
              {subiendo ? 'La Inteligencia Artificial está trabajando...' : 'Sube un PDF y la IA extraerá los datos automáticamente.'}
            </p>
          </div>
        </div>

        {/* Tabla Dinámica */}
        <div className="col-span-12 xl:col-span-9 flex flex-col gap-stack-md">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant/50">
                <tr>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Candidato</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Puesto</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Compatibilidad</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase">Estado</th>
                  <th className="py-3 px-4 font-label-md text-[12px] font-bold text-on-surface-variant uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-8">Cargando...</td></tr>
                ) : postulantes.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8">No hay postulantes registrados.</td></tr>
                ) : (
                  postulantes.map((post) => (
                    <tr key={post.id} className="hover:bg-surface-container-high transition-colors bg-surface-container-lowest">
                      <td className="py-2 px-4 font-data-mono font-semibold text-[14px]">{post.nombre_completo}</td>
                      <td className="py-2 px-4 font-body-sm text-[13px]">{post.convocatorias?.puesto || 'No asignado'}</td>
                      <td className="py-2 px-4 w-44">
                        <div className="flex items-center gap-2">
                          <span className="font-data-mono text-[14px] font-bold text-on-surface">{post.compatibilidad}%</span>
                          <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${post.compatibilidad}%` }}></div>
                          </div>
                        </div>
                      </td>
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
                        <Link to={`/detalle/${post.id}`} className="text-primary hover:text-primary/80 font-label-md text-[12px] font-bold">Ver Detalle</Link>
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