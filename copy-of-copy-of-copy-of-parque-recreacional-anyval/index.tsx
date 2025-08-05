import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

const { useState, useEffect, useMemo, useCallback, useRef } = React;

// --- START OF TYPES (types.ts) ---
const PostCategory = {
  Eventos: 'Eventos',
  Actividades: 'Actividades',
  BuscandoGrupo: 'Buscando Grupo',
  Sugerencias: 'Sugerencias',
  Seguridad: 'Seguridad',
  FotosYRecuerdos: 'Fotos y Recuerdos',
  General: 'General',
  Unknown: 'Desconocido'
};

// --- START OF ICONS ---
const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M12 4v16m8-8H4" })
  )
);
const HeartIcon = ({ isLiked, ...props }: React.SVGProps<SVGSVGElement> & { isLiked?: boolean }) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: isLiked ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" })
  )
);
const CommentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" })
  )
);
const TagIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM11 7h.01" }),
    React.createElement('path', { d: "M3 3v11a2 2 0 002 2h11" })
  )
);
const PhotoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('path', { d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" })
    )
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", viewBox: "0 0 24 24" },
        React.createElement('path', { fillRule: "evenodd", d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.707 12.293a1 1 0 01-1.414 1.414L12 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L10.586 12 8.293 9.707a1 1 0 011.414-1.414L12 10.586l2.293-2.293a1 1 0 011.414 1.414L13.414 12l2.293 2.293z", clipRule: "evenodd" })
    )
);
const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" })
  )
);
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" },
        React.createElement('path', { fillRule: "evenodd", d: "M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z", clipRule: "evenodd" })
    )
);
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" })
  )
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })
  )
);
const ExclamationTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })
  )
);
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  React.createElement('svg', { ...props, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement('path', { d: "M6 18L18 6M6 6l12 12" })
  )
);

// --- START OF SERVICES (geminiService.ts) ---
let ai;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {
    console.error("Error al inicializar GoogleGenAI:", e);
    const rootDiv = document.getElementById('root');
    if (rootDiv) {
        rootDiv.innerHTML = `<div class="fixed inset-0 flex items-center justify-center bg-slate-900"><div class="text-center p-8 bg-rose-900/50 border border-rose-700 rounded-xl max-w-lg"><h2 class="text-2xl font-bold text-white mb-2">Error de Configuración</h2><p class="text-rose-200">No se pudo inicializar la IA. Asegúrate de que la API_KEY de Google AI esté configurada correctamente en las variables de entorno de tu entorno de despliegue (por ejemplo, en Netlify).</p><p class="text-xs text-rose-300/50 mt-4">Error original: ${e.message}</p></div></div>`;
    }
}
// --- FIN DE LA SECCIÓN DE CONFIGURACIÓN ---

const validCategories = Object.values(PostCategory).filter(c => c !== PostCategory.Unknown && c !== PostCategory.General);
const postSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      userName: { type: Type.STRING, description: "El nombre del autor del post." },
      content: { type: Type.STRING, description: "El contenido del post." },
      category: { 
        type: Type.STRING, 
        description: `La categoría del post. Debe ser una de: ${validCategories.join(', ')}.`
      },
    },
    required: ["userName", "content", "category"]
  }
};

const generateInitialPosts = async () => {
  try {
    if (!ai) throw new Error("Cliente de IA no inicializado.");
    const prompt = `Genera 6 posts de redes sociales realistas para la app comunitaria del "Parque Recreacional Anyval". Los temas deben ser variados y típicos de un parque: una invitación para un partido de voleibol, un aviso de un objeto perdido (llaves), una foto del atardecer en el lago, una sugerencia para instalar más fuentes de agua, el anuncio de un picnic familiar y una pregunta sobre si se puede llevar perros a una zona específica. Para cada post, incluye un userName, content y una category. La categoría debe ser una de las siguientes: ${validCategories.join(', ')}. Devuelve los datos como un array JSON válido.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: postSchema,
      },
    });

    const jsonResponse = JSON.parse(response.text);
    
    return jsonResponse.map((item, index) => ({
      id: `post-${Date.now()}-${index}`,
      author: {
        name: item.userName,
        avatarUrl: `https://i.pravatar.cc/150?u=${item.userName.replace(/\s/g, '')}`
      },
      category: Object.values(PostCategory).find(c => c === item.category) || PostCategory.General,
      content: item.content,
      timestamp: `${Math.floor(Math.random() * 58) + 2}m`,
      likes: Math.floor(Math.random() * 50),
      comments: []
    }));
  } catch (error) {
    console.error("Error al generar posts iniciales con Gemini:", error);
    return [
        { id: 'fallback-1', author: { name: 'Elena Sol', avatarUrl: 'https://i.pravatar.cc/150?u=ElenaSol' }, category: PostCategory.FotosYRecuerdos, content: '¡Qué atardecer más increíble hoy en el lago! 🌅 #Anyval', timestamp: '5m', likes: 25, comments: [] },
        { id: 'fallback-2', author: { name: 'Marcos Runner', avatarUrl: 'https://i.pravatar.cc/150?u=MarcosRunner' }, category: PostCategory.Actividades, content: '¿Alguien para correr mañana a las 7am? Nos vemos en la entrada principal.', timestamp: '15m', likes: 8, comments: [] },
        { id: 'fallback-3', author: { name: 'Familia Perez', avatarUrl: 'https://i.pravatar.cc/150?u=FamiliaPerez' }, category: PostCategory.Eventos, content: 'Estamos organizando un picnic comunitario el próximo sábado. ¡Todos son bienvenidos a traer algo para compartir!', timestamp: '45m', likes: 18, comments: [] },
    ];
  }
};

const categorizePost = async (postContent) => {
    if(!postContent || postContent.trim().length < 10) {
        return PostCategory.General;
    }
    try {
        if (!ai) throw new Error("Cliente de IA no inicializado.");
        const prompt = `Clasifica el siguiente texto de una publicación del parque recreacional en la categoría más relevante. Las categorías posibles son: ${validCategories.join(', ')}. Devuelve solo el nombre de la categoría. Texto del post: "${postContent}"`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        const categoryText = response.text.trim();
        const category = Object.values(PostCategory).find(c => c.toLowerCase() === categoryText.toLowerCase());
        return category || PostCategory.General;
    } catch(error) {
        console.error("Error al categorizar post con Gemini:", error);
        return PostCategory.General;
    }
};

// --- START OF COMPONENTS ---
const PostCategoryBadge = ({ category, size = 'md' }) => {
  const categoryColors = {
    [PostCategory.Eventos]: 'bg-fuchsia-500/10 text-fuchsia-400',
    [PostCategory.Actividades]: 'bg-cyan-500/10 text-cyan-400',
    [PostCategory.BuscandoGrupo]: 'bg-yellow-500/10 text-yellow-400',
    [PostCategory.Sugerencias]: 'bg-lime-500/10 text-lime-400',
    [PostCategory.Seguridad]: 'bg-rose-500/10 text-rose-400',
    [PostCategory.FotosYRecuerdos]: 'bg-orange-500/10 text-orange-400',
    [PostCategory.General]: 'bg-slate-500/10 text-slate-400',
    [PostCategory.Unknown]: 'bg-gray-500/10 text-gray-400',
  };
  const colorClasses = categoryColors[category] || categoryColors[PostCategory.General];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return React.createElement('div', { className: `inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses} ${colorClasses}` },
    React.createElement(TagIcon, { className: "w-4 h-4" }),
    React.createElement('span', null, category)
  );
};

const PostCard = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return React.createElement('div', { className: "bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg transition-shadow hover:shadow-2xl hover:border-slate-600 w-full overflow-hidden" },
    React.createElement('div', { className: "p-5" },
      React.createElement('div', { className: "flex items-start justify-between mb-4" },
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('img', { src: post.author.avatarUrl, alt: post.author.name, className: "w-12 h-12 rounded-full object-cover border-2 border-slate-700" }),
          React.createElement('div', null,
            React.createElement('p', { className: "font-semibold text-slate-100" }, post.author.name),
            React.createElement('p', { className: "text-xs text-slate-400" }, post.timestamp)
          )
        ),
        React.createElement(PostCategoryBadge, { category: post.category })
      ),
      React.createElement('p', { className: "text-slate-300 whitespace-pre-wrap leading-relaxed mb-4" }, post.content),
      post.media && React.createElement('div', { className: "mt-4 rounded-lg overflow-hidden border border-slate-800" },
        post.media.type === 'image' ? 
          React.createElement('img', { src: post.media.url, alt: "Contenido de la publicación", className: "w-full h-auto object-cover" }) :
          React.createElement('video', { src: post.media.url, controls: true, className: "w-full h-auto" })
      )
    ),
    React.createElement('div', { className: "px-5 py-3 border-t border-slate-800 flex items-center gap-6" },
      React.createElement('button', { onClick: handleLike, className: `flex items-center gap-2 text-slate-400 hover:text-fuchsia-500 transition-colors group ${isLiked ? 'text-fuchsia-500' : ''}` },
        React.createElement(HeartIcon, { className: "w-5 h-5", isLiked: isLiked }),
        React.createElement('span', { className: "text-sm font-medium" }, likes)
      ),
      React.createElement('button', { className: "flex items-center gap-2 text-slate-400 hover:text-cyan-500 transition-colors group" },
        React.createElement(CommentIcon, { className: "w-5 h-5" }),
        React.createElement('span', { className: "text-sm font-medium" }, post.comments.length)
      )
    )
  );
};

const CreatePostModal = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [suggestedCategory, setSuggestedCategory] = useState(PostCategory.General);
    const [isCategorizing, setIsCategorizing] = useState(false);
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const fileInputRef = useRef(null);

    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => setDebouncedValue(value), delay);
            return () => clearTimeout(handler);
        }, [value, delay]);
        return debouncedValue;
    };
    const debouncedContent = useDebounce(content, 1000);

    const cleanup = useCallback(() => {
        setContent('');
        setSuggestedCategory(PostCategory.General);
        setMediaFile(null);
        if(mediaPreview) URL.revokeObjectURL(mediaPreview);
        setMediaPreview(null);
    },[mediaPreview]);

    const handleClose = () => { cleanup(); onClose(); };

    const fetchCategory = useCallback(async (text) => {
        if (text.trim().length > 10) {
            setIsCategorizing(true);
            const category = await categorizePost(text);
            setSuggestedCategory(category);
            setIsCategorizing(false);
        } else {
            setSuggestedCategory(PostCategory.General);
        }
    }, []);

    useEffect(() => { fetchCategory(debouncedContent); }, [debouncedContent, fetchCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onSubmit(content, suggestedCategory, mediaFile);
            handleClose();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
            if (mediaPreview) URL.revokeObjectURL(mediaPreview);
            setMediaPreview(URL.createObjectURL(file));
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const removeMedia = () => {
        setMediaFile(null);
        if(mediaPreview) URL.revokeObjectURL(mediaPreview);
        setMediaPreview(null);
    };

    if (!isOpen) return null;

    return React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: handleClose },
        React.createElement('div', { className: "bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all", onClick: (e) => e.stopPropagation() },
            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('div', { className: "p-6" },
                    React.createElement('h2', { className: "text-2xl font-bold text-white mb-4" }, "Crear nueva publicación"),
                    React.createElement('textarea', { className: "w-full h-32 p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out resize-none", placeholder: "¿Qué está pasando en el parque? ¡Comparte tu experiencia en Anyval!", value: content, onChange: (e) => setContent(e.target.value), required: true }),
                    mediaPreview && React.createElement('div', { className: "mt-4 relative rounded-lg overflow-hidden border border-slate-700" },
                        mediaFile?.type.startsWith('image') ? React.createElement('img', { src: mediaPreview, alt: "Vista previa", className: "w-full h-auto max-h-60 object-cover" }) : React.createElement('video', { src: mediaPreview, controls: true, className: "w-full h-auto max-h-60" }),
                        React.createElement('button', { type: "button", onClick: removeMedia, className: "absolute top-2 right-2 bg-black/50 rounded-full p-1 text-white hover:bg-black/80 transition-colors", 'aria-label': "Eliminar medio" }, React.createElement(XCircleIcon, { className: "w-6 h-6" }))
                    ),
                    React.createElement('div', { className: "mt-4 flex items-center justify-between flex-wrap gap-4" },
                        React.createElement('input', { type: "file", ref: fileInputRef, onChange: handleFileChange, className: "hidden", accept: "image/*,video/*" }),
                        React.createElement('button', { type: "button", onClick: () => fileInputRef.current?.click(), className: "flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-600/40 transition-colors" },
                            React.createElement(PhotoIcon, { className: "w-5 h-5" }), "Añadir foto/video"
                        ),
                        React.createElement('div', { className: "flex items-center gap-2" },
                            React.createElement('span', { className: "text-sm font-medium text-slate-400" }, "Categoría sugerida:"),
                            isCategorizing ? React.createElement('div', { className: "flex items-center gap-2 text-sm text-slate-500" }, React.createElement('div', { className: "w-4 h-4 border-2 border-slate-600 border-t-fuchsia-500 rounded-full animate-spin" }), React.createElement('span', null, "Analizando...")) : React.createElement(PostCategoryBadge, { category: suggestedCategory })
                        )
                    )
                ),
                React.createElement('div', { className: "bg-slate-900/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-slate-800" },
                    React.createElement('button', { type: "button", onClick: handleClose, className: "px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500" }, "Cancelar"),
                    React.createElement('button', { type: "submit", disabled: !content.trim() || isCategorizing, className: "px-4 py-2 bg-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-fuchsia-600/20 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 disabled:bg-fuchsia-800/50 disabled:shadow-none disabled:cursor-not-allowed" }, "Publicar")
                )
            )
        )
    );
};

const LoginModal = ({ isOpen, onClose, onSubmit }) => {
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarInputRef = useRef(null);

    const cleanup = useCallback(() => {
        setUsername('');
        setPhone('');
        setAvatarFile(null);
        if(avatarPreview) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
    }, [avatarPreview]);

    const handleClose = () => { cleanup(); onClose(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username, phone, avatarFile);
            handleClose();
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    if (!isOpen) return null;

    return React.createElement('div', { className: "fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4", onClick: handleClose },
        React.createElement('div', { className: "bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-sm transform transition-all", onClick: (e) => e.stopPropagation() },
            React.createElement('form', { onSubmit: handleSubmit },
                React.createElement('div', { className: "p-8 text-center" },
                    React.createElement('div', { className: "relative w-24 h-24 mx-auto mb-4" },
                        React.createElement('img', { src: avatarPreview || `https://i.pravatar.cc/150?u=${username.replace(/\s/g, '') || 'default'}`, alt: "Avatar", className: "w-full h-full rounded-full object-cover border-4 border-slate-700" }),
                        React.createElement('input', { type: "file", ref: avatarInputRef, onChange: handleAvatarChange, className: "hidden", accept: "image/*" }),
                        React.createElement('button', { type: "button", onClick: () => avatarInputRef.current?.click(), className: "absolute -bottom-1 -right-1 bg-fuchsia-600 text-white rounded-full p-2 hover:bg-fuchsia-700 transition-colors", 'aria-label': "Cambiar foto de perfil" }, React.createElement(CameraIcon, { className: "w-4 h-4" }))
                    ),
                    React.createElement('h2', { className: "text-2xl font-bold text-white mb-2" }, "Crea tu perfil"),
                    React.createElement('p', { className: "text-slate-400 mb-6" }, "Únete a la comunidad de Anyval."),
                    React.createElement('div', { className: "space-y-4 text-left" },
                        React.createElement('input', { type: "text", className: "w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out", placeholder: "Nombre de usuario", value: username, onChange: (e) => setUsername(e.target.value), required: true, autoFocus: true }),
                        React.createElement('div', { className: "relative" },
                            React.createElement(PhoneIcon, { className: "w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" }),
                            React.createElement('input', { type: "tel", className: "w-full p-3 pl-10 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500 transition duration-150 ease-in-out", placeholder: "Número de teléfono (Opcional)", value: phone, onChange: (e) => setPhone(e.target.value) })
                        )
                    )
                ),
                React.createElement('div', { className: "bg-slate-900/50 px-6 py-4 flex justify-end gap-3 rounded-b-xl border-t border-slate-800" },
                    React.createElement('button', { type: "button", onClick: handleClose, className: "px-4 py-2 bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-lg shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500" }, "Cancelar"),
                    React.createElement('button', { type: "submit", disabled: !username.trim(), className: "px-4 py-2 bg-fuchsia-600 text-white font-semibold rounded-lg shadow-lg shadow-fuchsia-600/20 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 disabled:bg-fuchsia-800/50 disabled:shadow-none disabled:cursor-not-allowed" }, "Unirse")
                )
            )
        )
    );
};

const Sidebar = ({ currentUser, onLoginClick, onNewPostClick, activeFilter, onFilterChange }) => {
  const allCategories = Object.values(PostCategory).filter(c => c !== PostCategory.Unknown);
  const categoryDisplay = {
      [PostCategory.Eventos]: { name: 'Eventos', color: 'text-fuchsia-400' },
      [PostCategory.Actividades]: { name: 'Actividades', color: 'text-cyan-400' },
      [PostCategory.BuscandoGrupo]: { name: 'Buscando Grupo', color: 'text-yellow-400' },
      [PostCategory.Sugerencias]: { name: 'Sugerencias', color: 'text-lime-400' },
      [PostCategory.Seguridad]: { name: 'Seguridad', color: 'text-rose-400' },
      [PostCategory.FotosYRecuerdos]: { name: 'Fotos y Recuerdos', color: 'text-orange-400' },
      [PostCategory.General]: { name: 'General', color: 'text-slate-400' },
      [PostCategory.Unknown]: { name: 'Desconocido', color: 'text-gray-500' },
  };
  
  const FilterButton = ({ filter }) => {
    const isActive = activeFilter === filter;
    const displayName = filter === 'All' ? 'Todas' : categoryDisplay[filter]?.name || 'General';
    const activeClasses = 'bg-fuchsia-500/10 text-fuchsia-400 font-bold';
    const inactiveClasses = 'text-slate-300 hover:bg-slate-700/50 hover:text-white';
    return React.createElement('button', { onClick: () => onFilterChange(filter), className: `w-full text-left px-4 py-2.5 rounded-lg transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}` }, displayName);
  };

  return React.createElement('aside', { className: "w-full lg:w-72 flex-shrink-0 bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg" },
    React.createElement('div', { className: "mb-6" },
      currentUser ?
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('img', { src: currentUser.avatarUrl, alt: currentUser.name, className: "w-16 h-16 rounded-full object-cover border-4 border-fuchsia-500/50" }),
          React.createElement('div', null,
            React.createElement('h2', { className: "text-xl font-bold text-white" }, currentUser.name),
            React.createElement('p', { className: "text-sm text-slate-400" }, "¡Bienvenido de vuelta!")
          )
        ) :
        React.createElement('div', { className: "flex flex-col items-center text-center p-4 border-2 border-dashed border-slate-700 rounded-lg" },
          React.createElement('h2', { className: "text-xl font-bold text-white mb-2" }, "¡Únete a la comunidad!"),
          React.createElement('p', { className: "text-sm text-slate-400 mb-4" }, "Identifícate para publicar y participar."),
          React.createElement('button', { onClick: onLoginClick, className: "w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200" },
            React.createElement(LoginIcon, { className: "w-5 h-5" }), React.createElement('span', null, "Identifícate")
          )
        )
    ),
    React.createElement('button', { onClick: onNewPostClick, disabled: !currentUser, className: "w-full flex items-center justify-center gap-2 bg-fuchsia-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg shadow-fuchsia-600/20 hover:bg-fuchsia-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-fuchsia-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed" },
      React.createElement(PlusIcon, { className: "w-5 h-5" }),
      React.createElement('span', null, "Crear Publicación")
    ),
    React.createElement('hr', { className: "border-slate-800 my-8" }),
    React.createElement('h3', { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-4" }, "Categorías"),
    React.createElement('nav', { className: "flex flex-col gap-1" },
      React.createElement(FilterButton, { filter: "All" }),
      allCategories.map(cat => React.createElement(FilterButton, { key: cat, filter: cat }))
    )
  );
};

const Header = () => {
  return React.createElement('header', { className: "mb-8" },
    React.createElement('div', { className: "flex items-center gap-4 p-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl" },
      React.createElement('svg', { className: "w-12 h-12 text-fuchsia-500", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
        React.createElement('path', { d: "M12 2L2 7l10 5 10-5-10-5z" }),
        React.createElement('path', { d: "M2 17l10 5 10-5" }),
        React.createElement('path', { d: "M2 12l10 5 10-5" })
      ),
      React.createElement('div', null,
        React.createElement('h1', { className: "text-3xl font-bold text-white tracking-tight" }, "Parque Recreacional Anyval"),
        React.createElement('p', { className: "text-slate-400" }, "tu espacio de encuentro y diversion")
      )
    )
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  if (!ai) return null; // No renderizar la app si la IA no se inicializó
  
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw_qXfSpe7tA_go4GYE1nm5wh-nX36MKfDaJ3LAm80aiDJ8rf8vbz5wqgaWenCQbgAZ2A/exec';

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const saveUserToSheet = async (user) => {
    const userToSave = { ...user };
    if (userToSave.avatarUrl.startsWith('blob:')) {
        userToSave.avatarUrl = `https://i.pravatar.cc/150?u=${user.username.replace(/\s/g, '')}`;
    }
    try {
        const formData = new URLSearchParams();
        formData.append('username', userToSave.username);
        formData.append('phone', userToSave.phone || '');
        formData.append('avatarUrl', userToSave.avatarUrl);

        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors',
        });
        setNotification({ message: '¡Datos de perfil enviados a la comunidad!', type: 'success' });
    } catch (error) {
        console.error('Error inesperado al enviar a Google Sheet:', error);
        setNotification({ message: 'Ocurrió un error inesperado al intentar enviar tus datos.', type: 'error' });
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const initialPosts = await generateInitialPosts();
      setPosts(initialPosts);
      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  const handleLogin = (username, phone, avatarFile) => {
    if (username.trim()) {
      let avatarUrl = `https://i.pravatar.cc/150?u=${username.replace(/\s/g, '')}`;
      if (avatarFile) {
        avatarUrl = URL.createObjectURL(avatarFile);
      }
      const newUser = { name: username, avatarUrl: avatarUrl, phone: phone || undefined };
      setCurrentUser(newUser);
      setIsLoginModalOpen(false);
      saveUserToSheet({ username: newUser.name, phone: newUser.phone || '', avatarUrl: newUser.avatarUrl });
    }
  };

  const handleCreatePost = (content, category, mediaFile) => {
    if (!currentUser) return;
    let mediaData = undefined;
    if (mediaFile) {
        mediaData = { url: URL.createObjectURL(mediaFile), type: mediaFile.type.startsWith('image/') ? 'image' : 'video' };
    }
    const newPost = {
      id: `post-${Date.now()}`,
      author: currentUser,
      content,
      category,
      timestamp: 'Justo ahora',
      likes: 0,
      comments: [],
      media: mediaData
    };
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = useMemo(() => {
    if (activeFilter === 'All') return posts;
    return posts.filter(post => post.category === activeFilter);
  }, [posts, activeFilter]);

  const SkeletonLoader = () => React.createElement('div', { className: "bg-slate-900/70 border border-slate-700/50 rounded-xl shadow-lg p-5 animate-pulse" },
    React.createElement('div', { className: "flex items-center mb-4" },
        React.createElement('div', { className: "w-12 h-12 rounded-full bg-slate-800" }),
        React.createElement('div', { className: "ml-4 flex-1" },
            React.createElement('div', { className: "h-4 bg-slate-800 rounded w-1/4" }),
            React.createElement('div', { className: "h-3 bg-slate-800 rounded w-1/6 mt-2" })
        )
    ),
    React.createElement('div', { className: "space-y-3 mt-4" },
        React.createElement('div', { className: "h-4 bg-slate-800 rounded" }),
        React.createElement('div', { className: "h-4 bg-slate-800 rounded w-5/6" })
    )
  );

  return React.createElement('div', { className: "min-h-screen bg-slate-900 text-slate-200" },
    React.createElement('main', { className: "max-w-7xl mx-auto p-4 md:p-8" },
      React.createElement(Header, null),
      React.createElement('div', { className: "flex flex-col lg:flex-row gap-8" },
        React.createElement(Sidebar, { currentUser, onLoginClick: () => setIsLoginModalOpen(true), onNewPostClick: () => setIsCreateModalOpen(true), activeFilter, onFilterChange: setActiveFilter }),
        React.createElement('div', { className: "flex-1 min-w-0" },
          React.createElement('div', { className: "flex flex-col gap-6" },
            isLoading ? Array.from({ length: 3 }).map((_, index) => React.createElement(SkeletonLoader, { key: index })) :
            (filteredPosts.length > 0 ? filteredPosts.map(post => React.createElement(PostCard, { key: post.id, post })) :
              React.createElement('div', { className: "text-center py-16 px-6 bg-slate-900/70 border border-slate-700/50 rounded-xl shadow-lg" },
                React.createElement('h3', { className: "text-xl font-semibold text-slate-200" }, "No hay publicaciones aquí"),
                React.createElement('p', { className: "text-slate-400 mt-2" }, "Parece que esta categoría está vacía. ¡Anímate a ser el primero en publicar!")
              )
            )
          )
        )
      )
    ),
    notification && React.createElement('div', { className: `fixed top-5 right-5 w-full max-w-sm rounded-lg shadow-2xl p-4 flex items-start gap-3 z-50 transition-all transform animate-in slide-in-from-right ${notification.type === 'success' ? 'bg-emerald-600/90 border border-emerald-500' : 'bg-rose-600/90 border border-rose-500'}` },
        React.createElement('div', { className: "flex-shrink-0 text-white mt-0.5" }, notification.type === 'success' ? React.createElement(CheckCircleIcon, { className: "h-6 w-6" }) : React.createElement(ExclamationTriangleIcon, { className: "h-6 w-6" })),
        React.createElement('div', { className: "flex-1" },
            React.createElement('p', { className: "font-bold text-white" }, notification.type === 'success' ? 'Éxito' : 'Error'),
            React.createElement('p', { className: "text-sm text-white/90" }, notification.message)
        ),
        React.createElement('button', { onClick: () => setNotification(null), className: "text-white/70 hover:text-white transition-colors" }, React.createElement(XIcon, { className: "h-5 w-5" }))
    ),
    React.createElement(CreatePostModal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), onSubmit: handleCreatePost }),
    React.createElement(LoginModal, { isOpen: isLoginModalOpen, onClose: () => setIsLoginModalOpen(false), onSubmit: handleLogin })
  );
};

// --- RENDER THE APP ---
if (ai) { // Only render the app if the AI client was successfully initialized
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("Could not find root element to mount to");
    }
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(React.StrictMode, null, React.createElement(App, null)));
}