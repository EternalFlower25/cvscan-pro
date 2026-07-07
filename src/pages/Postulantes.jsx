import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Postulantes() {
  const [postulantes, setPostulantes] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]); // Nueva variable para las vacantes
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(''); // Guarda la opción elegida
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [estadoIA, setEstadoIA] = useState('Carga Masiva de CVs');
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    obtenerPostulantes();
    obtenerConvocatorias(); // Cargamos las vacantes al abrir la página
  }, []);

  const obtenerConvocatorias = async () => {
    try {
      const { data, error } = await supabase.from('convocatorias').select('id, puesto');
      if (error) throw error;
      setConvocatorias(data || []);
    } catch (error) {
      console.error('Error al obtener convocatorias:', error.message);
    }
  };

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
    if (!subiendo) {
      // Bloqueamos el clic si no ha elegido una vacante
      if (!convocatoriaSeleccionada) {
        alert('⚠️ Por favor, selecciona una vacante en el menú antes de subir los CVs.');
        return;
      }
      fileInputRef.current.click();
    }
  };

  const procesarConIA = async (base64Data) => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

      const prompt = `Eres un reclutador experto y analista de Recursos Humanos. Analiza exhaustivamente este CV en formato PDF. 
      Devuelve la respuesta en formato JSON puro, sin comillas invertidas, sin markdown y sin la palabra "json".
      El objeto JSON DEBE tener exactamente esta estructura:
      {
        "nombre_completo": "Nombre y apellidos del candidato",
        "correo": "El correo electrónico encontrado (o 'No especificado')",
        "telefono": "El número de teléfono encontrado (o 'No especificado')",
        "grado": "Título profesional más alto (Ej: Licenciada en Contabilidad)",
        "anios_experiencia": un número entero con la suma total aproximada de años de experiencia laboral,
        "compatibilidad": un número entero del 0 al 100 evaluando qué tan fuerte es el perfil,
        "resumen": "Un resumen profesional directo de 2 líneas",
        "analisis_detallado": "Análisis profundo. Usa saltos de línea dobles para separar visualmente: 1) Su experiencia laboral, 2) Justificación de compatibilidad, 3) Recomendación final.",
        "estado": "Apto" (si compatibilidad >= 80) o "Observado" (si es menor a 80)
      }`;

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Data, mimeType: 'application/pdf' } }
      ]);

      let textoRespuesta = result.response.text();
      textoRespuesta = textoRespuesta.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(textoRespuesta);
    } catch (error) {
      console.error("Error en IA:", error);
      throw new Error("La IA no pudo procesar este documento.");
    }
  };

  // NUEVA FUNCIÓN PARA MÚLTIPLES ARCHIVOS
  const subirMultiplesCVs = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setSubiendo(true);

    // Bucle para procesar 1 por 1 y no saturar a la IA
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.type !== 'application/pdf') {
        console.warn(`El archivo ${file.name} no es PDF. Omitiendo.`);
        continue;
      }

      setEstadoIA(`Procesando (${i + 1}/${files.length}): ${file.name}...`);

      try {
        await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          reader.onload = async () => {
            try {
              const base64Data = reader.result.split(',')[1];
              const datosIA = await procesarConIA(base64Data);

              const filePath = `cv_docs/${Math.random().toString(36).substring(7)}-${file.name}`;
              const { error: uploadError } = await supabase.storage.from('cvx').upload(filePath, file);
              if (uploadError) throw uploadError;

              const { data: urlData } = supabase.storage.from('cvx').getPublicUrl(filePath);

              const analisisCompleto = `
                <div class="mb-5">
                  <h4 class="font-bold text-[14px] text-primary uppercase tracking-wider mb-2">Resumen Ejecutivo</h4>
                  <p class="text-[14px] text-on-surface-variant leading-relaxed">${datosIA.resumen}</p>
                </div>
                <div>
                  <h4 class="font-bold text-[14px] text-primary uppercase tracking-wider mb-2">Análisis Profundo de la IA</h4>
                  <p class="text-[14px] text-on-surface-variant whitespace-pre-wrap leading-relaxed">${datosIA.analisis_detallado}</p>
                </div>
              `;

              const { error: insertError } = await supabase.from('postulantes').insert([{
                convocatoria_id: convocatoriaSeleccionada, // AHORA USA LA VACANTE ELEGIDA EN EL MENÚ
                nombre_completo: datosIA.nombre_completo || 'Candidato Desconocido',
                correo: datosIA.correo || 'No especificado',
                telefono: datosIA.telefono || 'No especificado',
                anios_experiencia: datosIA.anios_experiencia || 0,
                compatibilidad: datosIA.compatibilidad || 70,
                grado: datosIA.grado || 'No especificado',
                resumen_ia: analisisCompleto,
                estado: datosIA.estado || 'Observado',
                cv_url: urlData.publicUrl
              }]);

              if (insertError) throw insertError;
              resolve(); // Termina este CV y pasa al siguiente
              
            } catch (err) {
              console.error(`Error con ${file.name}:`, err);
              resolve(); // Resuelve incluso si hay error para no detener la cola
            }
          };
        });
      } catch (error) {
        console.error(`Fallo crítico con ${file.name}`, error);
      }
    }

    // Una vez que termina el bucle de todos los archivos:
    setSubiendo(false);
    setEstadoIA('Carga Masiva de CVs');
    event.target.value = null; 
    obtenerPostulantes();
    alert(`¡Se procesaron los ${files.length} documentos con éxito!`);
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
        {/* PANEL IZQUIERDO: SELECCIÓN Y CARGA */}
        <div className="col-span-12 xl:col-span-3 h-full flex flex-col gap-4">
          
          {/* Nuevo Menú Desplegable */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <label className="block font-label-md text-[12px] font-bold text-primary uppercase tracking-wider mb-2">
              1. Asignar a Vacante
            </label>
            <select
              value={convocatoriaSeleccionada}
              onChange={(e) => setConvocatoriaSeleccionada(e.target.value)}
              disabled={subiendo}
              className="w-full p-2.5 bg-surface-container rounded-lg border border-outline-variant font-body-sm text-[13px] text-on-surface outline-none focus:border-primary transition-colors disabled:opacity-50"
            >
              <option value="">-- Selecciona una opción --</option>
              {convocatorias.map(conv => (
                <option key={conv.id} value={conv.id}>{conv.puesto}</option>
              ))}
            </select>
          </div>

          {/* Área de Carga (Ahora acepta múltiples archivos) */}
          <input type="file" accept=".pdf" multiple ref={fileInputRef} onChange={subirMultiplesCVs} className="hidden" />
          <div 
            onClick={handleCargaClick} 
            className={`bg-surface-container-lowest border-2 border-dashed rounded-xl p-6 flex-1 flex flex-col justify-center items-center text-center transition-colors group 
            ${!convocatoriaSeleccionada ? 'border-outline-variant/50 bg-surface-container/30 cursor-not-allowed grayscale' : 'border-outline-variant hover:bg-surface-container-low cursor-pointer'} 
            ${subiendo ? 'opacity-80 cursor-wait bg-surface-container-low' : ''}`}
            style={{ minHeight: '180px' }}
          >
            <div className={`w-12 h-12 bg-surface-container rounded-full flex items-center justify-center mb-4 ${convocatoriaSeleccionada && !subiendo ? 'group-hover:scale-110 transition-transform' : ''}`}>
              {subiendo ? (
                <span className="material-symbols-outlined text-primary text-[28px] animate-spin">sync</span>
              ) : (
                <span className={`material-symbols-outlined text-[28px] ${!convocatoriaSeleccionada ? 'text-outline-variant' : 'text-primary'}`}>auto_awesome</span>
              )}
            </div>
            <h3 className={`font-label-md text-[12px] font-bold mb-2 ${!convocatoriaSeleccionada ? 'text-outline' : 'text-on-surface'}`}>{estadoIA}</h3>
            <p className="font-body-sm text-[13px] text-outline px-4">
              {subiendo ? 'La IA está procesando la cola de archivos...' : 'Sube uno o varios PDFs al mismo tiempo.'}
            </p>
          </div>
        </div>

        {/* TABLA DERECHA */}
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