import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function NuevaConvocatoria() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigo: '',
    puesto: '',
    nivel: 'Secundaria', 
    descripcion: '',
    estado: 'Abierta'
  });

  // --- NUEVOS ESTADOS PARA REDES SOCIALES E IA ---
  const [postSocial, setPostSocial] = useState('');
  const [generandoPost, setGenerandoPost] = useState(false);
  const [redes, setRedes] = useState({
    facebook: false,
    instagram: false,
    linkedin: false
  });

  // Función para llamar a Gemini y crear el Copy de marketing
  const generarPostConIA = async () => {
    if (!formData.puesto || !formData.descripcion) {
      alert('⚠️ Por favor, llena el nombre del puesto y la descripción antes de generar el post.');
      return;
    }

    setGenerandoPost(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      // Usamos el modelo 2.5 flash que sabemos que te funciona bien
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const prompt = `Actúa como un experto en marketing digital y Recursos Humanos para una prestigiosa institución educativa. 
      Redacta una publicación sumamente atractiva para redes sociales anunciando una nueva vacante.
      Puesto: ${formData.puesto}
      Nivel: ${formData.nivel}
      Detalles y Requisitos: ${formData.descripcion}
      
      Reglas:
      - Usa un tono profesional, entusiasta y acogedor.
      - Incluye emojis estratégicos.
      - Termina con un llamado a la acción (Call to Action) invitando a postular.
      - Incluye de 3 a 5 hashtags relevantes.
      - Devuelve ÚNICAMENTE el texto de la publicación, sin introducciones tuyas.`;

      const result = await model.generateContent(prompt);
      setPostSocial(result.response.text());
    } catch (error) {
      console.error("Error al generar post:", error);
      alert('Hubo un error al conectar con la IA. Intenta de nuevo.');
    } finally {
      setGenerandoPost(false);
    }
  };

  const handleRedToggle = (red) => {
    setRedes(prev => ({ ...prev, [red]: !prev[red] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Guardamos la convocatoria en tu base de datos (Supabase)
      const { data: nuevaConvocatoria, error } = await supabase
        .from('convocatorias')
        .insert([formData])
        .select(); // El .select() nos devuelve los datos recién creados, incluyendo su ID

      if (error) throw error;
      
      // 2. Verificamos si hay que enviar a Redes Sociales
      const publicarEnRedes = redes.facebook || redes.instagram || redes.linkedin;
      
      if (publicarEnRedes && postSocial) {
        // Aquí enviamos los datos a tu Webhook de Make o Zapier
        // NOTA: Reemplaza "TU_URL_DE_WEBHOOK_AQUI" con la URL real que te dé Make/Zapier
        const webhookUrl = "https://hook.us2.make.com/68riihxael4aax51eilso33thjovcdgl"; 
        
        // Lo envolvemos en un try/catch para que si falla el webhook, igual se guarde la vacante
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              vacante_id: nuevaConvocatoria[0].id,
              puesto: formData.puesto,
              texto_publicacion: postSocial,
              redes_destino: redes
            })
          });
          console.log("Datos enviados al webhook exitosamente.");
        } catch (webhookError) {
          console.warn("La vacante se guardó, pero hubo un error enviando a redes:", webhookError);
        }
      }

      alert('¡Vacante creada con éxito!');
      navigate('/convocatorias');
    } catch (error) {
      console.error(error);
      alert('Error al crear la vacante: ' + error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end pb-2 border-b border-outline-variant/30">
        <div>
          <p className="font-label-md text-[12px] font-bold text-outline mb-1 uppercase tracking-wider">Reclutamiento</p>
          <h2 className="font-headline-md text-[24px] font-bold text-on-surface">Crear Nueva Vacante</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: FORMULARIO PRINCIPAL */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-6 h-fit">
          <form id="form-vacante" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Código</label>
                <input className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary font-body-sm text-[14px]" 
                  placeholder="Ej. MAT-001" required 
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})} />
              </div>
              <div>
                <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Nivel</label>
                <select className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary font-body-sm text-[14px]" required
                  onChange={(e) => setFormData({...formData, nivel: e.target.value})} defaultValue="Secundaria">
                  <option value="Primaria">Primaria</option>
                  <option value="Secundaria">Secundaria</option>
                  <option value="Administrativo">Administrativo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Nombre del Puesto</label>
              <input className="w-full p-2.5 border border-outline-variant rounded-lg focus:outline-none focus:border-primary font-body-sm text-[14px]" 
                placeholder="Ej. Profesor de Matemáticas" required 
                onChange={(e) => setFormData({...formData, puesto: e.target.value})} />
            </div>
            
            <div>
              <label className="block font-label-md text-[12px] font-bold text-on-surface-variant mb-1 uppercase">Descripción y Requisitos</label>
              <textarea className="w-full p-3 border border-outline-variant rounded-lg h-32 focus:outline-none focus:border-primary font-body-sm text-[14px] resize-none" 
                placeholder="Describa el perfil buscado, los años de experiencia necesarios y las responsabilidades principales..." required 
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})} />
            </div>
          </form>
        </div>

        {/* PANEL DERECHO: MARKETING IA & REDES SOCIALES */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="bg-surface-container-low rounded-xl border border-outline-variant p-5 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <span className="material-symbols-outlined text-[20px]">campaign</span>
              <h3 className="font-bold text-[15px] uppercase tracking-wider">Difusión en Redes</h3>
            </div>

            {/* Generador IA */}
            <div className="mb-5 flex flex-col flex-1">
              <button 
                type="button"
                onClick={generarPostConIA}
                disabled={generandoPost}
                className="w-full flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container py-2.5 rounded-lg font-bold text-[13px] hover:bg-secondary-container/80 transition-colors disabled:opacity-50 mb-3 border border-secondary-container/50 shadow-sm"
              >
                {generandoPost ? (
                  <><span className="material-symbols-outlined animate-spin text-[18px]">sync</span> Redactando...</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">auto_awesome</span> Generar Copy con IA</>
                )}
              </button>

              <textarea 
                value={postSocial}
                onChange={(e) => setPostSocial(e.target.value)}
                placeholder="Aquí aparecerá el post generado por la IA. Puedes editarlo antes de publicarlo..."
                className="w-full p-3 border border-outline-variant rounded-lg flex-1 min-h-[150px] focus:outline-none focus:border-primary font-body-sm text-[13px] text-on-surface-variant bg-surface-container-lowest resize-none"
              />
            </div>

            {/* Interruptores de Redes Sociales */}
            <div className="pt-4 border-t border-outline-variant/50">
              <p className="font-label-md text-[11px] text-outline mb-3 uppercase tracking-wider">Selecciona las plataformas:</p>
              <div className="flex justify-between gap-2">
                
                <button type="button" onClick={() => handleRedToggle('facebook')} 
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                    redes.facebook ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-surface-container-lowest border-outline-variant text-outline hover:bg-surface-container'
                }`}>
                  <span className="material-symbols-outlined mb-1">thumb_up</span>
                  <span className="font-bold text-[11px]">Facebook</span>
                </button>

                <button type="button" onClick={() => handleRedToggle('instagram')} 
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                    redes.instagram ? 'bg-pink-50 border-pink-200 text-pink-700 shadow-sm' : 'bg-surface-container-lowest border-outline-variant text-outline hover:bg-surface-container'
                }`}>
                  <span className="material-symbols-outlined mb-1">photo_camera</span>
                  <span className="font-bold text-[11px]">Instagram</span>
                </button>

                <button type="button" onClick={() => handleRedToggle('linkedin')} 
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-lg border transition-all ${
                    redes.linkedin ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' : 'bg-surface-container-lowest border-outline-variant text-outline hover:bg-surface-container'
                }`}>
                  <span className="material-symbols-outlined mb-1">work</span>
                  <span className="font-bold text-[11px]">LinkedIn</span>
                </button>

              </div>
            </div>

          </div>

          {/* BOTÓN PRINCIPAL DE GUARDAR Y PUBLICAR */}
          <button 
            type="submit" 
            form="form-vacante" // Enlaza el botón externo con el formulario principal
            className="w-full bg-primary text-on-primary py-3.5 rounded-xl font-bold text-[15px] hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">rocket_launch</span>
            Guardar y Finalizar
          </button>
        </div>
      </div>
    </div>
  );
}