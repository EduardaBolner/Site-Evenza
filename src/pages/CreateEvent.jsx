import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postPoint } from "../services/mapService";
import { Navbar } from "../components/Navbar";

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM7 10H12V15H7V10Z" fill="#aaa"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#aaa"/>
  </svg>
);

const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#aaa"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z" fill="#aaa"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="#aaa"/>
  </svg>
);

const CATEGORIAS = ["Música", "Cultura", "Festa", "Entretenimento", "Congresso", "Seminário", "Esporte", "Show", "Feira", "Rodeio", "Inauguração", "Exposição", "Workshop", "Automóvel", "Festival", "Outros"];
const ACESSIBILIDADE = ["Físico", "Visual", "Auditivo", "Todas"];
const INSCRICOES = ["Pago", "Gratuito", "Sem Inscrição"];

function RowField({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <label className="flex items-center gap-3 py-3 border-b border-gray-100 cursor-pointer w-full">
      <span className="shrink-0">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 bg-transparent text-[#333] text-[15px] outline-none placeholder:text-[#bbb] w-full"
      />
      <ChevronIcon />
    </label>
  );
}

export function CreateEvent() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [site, setSite] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [acessibilidade, setAcessibilidade] = useState([]);
  const [inscricao, setInscricao] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Usa coords do mapa se disponíveis, senão pega GPS
  useEffect(() => {
    if (location.state?.lat && location.state?.lng) {
      setLat(location.state.lat.toFixed(6));
      setLng(location.state.lng.toFixed(6));
      if (location.state.endereco) setLocalizacao(location.state.endereco);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(6));
          setLng(pos.coords.longitude.toFixed(6));
        },
        () => {}
      );
    }
  }, []);

  const toggleChip = (list, setList, value) => {
    setList((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    setErro("");
    if (!titulo.trim()) return setErro("Informe o título do evento.");
    if (categorias.length === 0) return setErro("Selecione ao menos uma categoria.");

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (isNaN(latitude) || isNaN(longitude)) return setErro("Não foi possível obter a localização. Ative o GPS e tente novamente.");

    setLoading(true);
    try {
      await postPoint(token, { descricao: titulo, latitude, longitude });
      navigate("/map");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pb-[80px]">
      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-5 pt-8">

        {/* Sobre o evento */}
        <p className="text-[11px] font-semibold text-[#aaa] uppercase tracking-widest mb-3">Sobre o Evento</p>

        <div className="mb-1">
          <p className="text-[13px] font-semibold text-[#333] mb-1">Título <span className="text-red-500">*</span></p>
          <input
            type="text"
            placeholder="Ex: Festival de Verão 2026"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full border border-gray-200 rounded-[10px] px-3 h-[44px] text-[15px] text-[#333] outline-none placeholder:text-[#ccc] focus:border-[#192853]"
          />
        </div>

        <div className="mt-4 mb-2">
          <p className="text-[13px] font-semibold text-[#333] mb-1">Descrição</p>
          <textarea
            placeholder="Conte mais sobre o evento..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-[10px] px-3 py-2 text-[15px] text-[#333] outline-none placeholder:text-[#ccc] resize-none focus:border-[#192853]"
          />
        </div>

        {/* Campos com ícone */}
        <div className="mt-2">
          <RowField icon={<CalendarIcon />} placeholder="Data" type="date" value={data} onChange={(e) => setData(e.target.value)} />
          <RowField icon={<ClockIcon />} placeholder="Horário" type="time" value={horario} onChange={(e) => setHorario(e.target.value)} />
          <RowField icon={<LocationIcon />} placeholder="Localização (ex: Rua XV, Centro)" value={localizacao} onChange={(e) => setLocalizacao(e.target.value)} />
          <RowField icon={<LinkIcon />} placeholder="Site ou Rede Social" value={site} onChange={(e) => setSite(e.target.value)} />
        </div>

        {/* Categoria */}
        <div className="mt-5">
          <p className="text-[13px] font-semibold text-[#333] mb-2">Categoria <span className="text-red-500">*</span></p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleChip(categorias, setCategorias, c)}
                className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${
                  categorias.includes(c)
                    ? "bg-[#192853] text-white border-[#192853]"
                    : "bg-white text-[#555] border-gray-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Acessibilidade */}
        <div className="mt-5">
          <p className="text-[13px] font-semibold text-[#333] mb-2">Mascaras de acessibilidade</p>
          <div className="flex flex-wrap gap-2">
            {ACESSIBILIDADE.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleChip(acessibilidade, setAcessibilidade, a)}
                className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${
                  acessibilidade.includes(a)
                    ? "bg-[#192853] text-white border-[#192853]"
                    : "bg-white text-[#555] border-gray-300"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Inscrições */}
        <div className="mt-5 mb-6">
          <p className="text-[13px] font-semibold text-[#333] mb-2">Inscrições</p>
          <div className="flex flex-wrap gap-2">
            {INSCRICOES.map((i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInscricao(i === inscricao ? "" : i)}
                className={`px-3 py-1 rounded-full text-[13px] font-medium border transition-all ${
                  inscricao === i
                    ? "bg-[#192853] text-white border-[#192853]"
                    : "bg-white text-[#555] border-gray-300"
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        {erro && <p className="text-red-500 text-sm text-center mb-3">{erro}</p>}

        {/* Botão publicar */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-[52px] rounded-full bg-[#ffe14e] text-[#192853] font-bold text-[16px] flex items-center justify-center gap-2 shadow-md hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60 mb-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#192853"/>
          </svg>
          {loading ? "Publicando..." : "Arraste para publicar o evento"}
        </button>

        {/* Cancelar */}
        <p
          className="text-center text-[13px] text-[#aaa] cursor-pointer hover:text-[#555] mb-4"
          onClick={() => navigate("/map")}
        >
          Cancelar
        </p>
      </div>

      <Navbar />
    </div>
  );
}
