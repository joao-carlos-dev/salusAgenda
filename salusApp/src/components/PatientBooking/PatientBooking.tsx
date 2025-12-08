import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  ValidateConsultationLinkApi,
  GetProfessionalDataById,
  GetProfessionalHoursAPI,
  SchedulingRegisterApi,
  type ScheduleRequestDto,
} from "../../services/salusApi";
import "./PatientBooking.css";

interface ProfessionalData {
  professionalData?: {
    name?: string;
    email?: string;
    occupation?: string;
    expertise?: string;
  };
  name?: string;
  occupation?: string;
  expertise?: string;
}

const PatientBooking = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();

  // Estados de Controle
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"auth-gate" | "booking">("auth-gate");

  // Dados
  const [doctorName, setDoctorName] = useState("");
  const [doctorExpertise, setDoctorExpertise] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [availableHours, setAvailableHours] = useState<string[]>([]);

  // Inputs do Agendamento
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    const initPage = async () => {
      if (!linkId) return;

      try {
        // 1. Valida Link (Público)
        const validateResponse = await ValidateConsultationLinkApi(linkId);
        const profId =
          validateResponse.data.professionalId ||
          validateResponse.data.id ||
          validateResponse.data;

        if (!profId) throw new Error("ID do médico inválido.");
        setProfessionalId(profId);

        // 2. Busca Dados Básicos do Médico (Para mostrar no cartão de boas-vindas)
        const docResponse = await GetProfessionalDataById(profId);
        const docData = docResponse.data as ProfessionalData;

        const pData = docData.professionalData || {};
        const name = pData.name || docData.name || "Doutor(a)";
        const expertise =
          pData.expertise || docData.expertise || "Clínico Geral";

        setDoctorName(name);
        setDoctorExpertise(expertise);

        // 3. Verifica se já está logado
        const savedData = sessionStorage.getItem("userData");
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData);
            const pId = parsed.id || parsed.userId || parsed.personalData?.id;

            if (pId) {
              setPatientId(pId);
              setStep("booking"); // Já logado? Vai direto pra agenda

              // Se já logado, busca os horários agora
              fetchHours(profId);
            }
          } catch {
            console.log("error");
          }
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("Erro:", err);
        if (error.response?.status === 404 || error.response?.status === 400) {
          setError("Link expirado ou inválido.");
        } else {
          setError("Erro ao carregar informações.");
        }
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [linkId]);

  // Função separada para buscar horários (só chama se for mostrar a agenda)
  const fetchHours = async (profId: string) => {
    try {
      const hoursResponse = await GetProfessionalHoursAPI(profId);
      let hoursList: string[] = [];
      const hData = hoursResponse.data;

      if (Array.isArray(hData)) {
        hoursList = hData;
      } else if (hData && typeof hData === "object") {
        if (hData.hours && Array.isArray(hData.hours)) hoursList = hData.hours;
        else hoursList = Object.keys(hData);
      }
      setAvailableHours(hoursList.map((h) => h.substring(0, 5)).sort());
    } catch (e) {
      console.error("Erro ao buscar horários", e);
    }
  };

  // --- AÇÕES DE NAVEGAÇÃO ---

  const handleGoToLogin = () => {
    // Salva a URL atual para voltar após login
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    navigate("/"); // Rota de Login
  };

  const handleGoToRegister = () => {
    // Salva a URL atual para voltar após cadastro -> login
    sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
    // Ajuste a rota abaixo para onde fica seu cadastro de paciente
    navigate("/register-patient");
  };

  // --- AÇÃO DE AGENDAR ---

  const handleConfirmBooking = async () => {
    if (!selectedTime) return alert("Selecione um horário.");

    const dateStr = selectedDate.toISOString().split("T")[0];
    const timeStr =
      selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

       navigate('/scheduleregister', {
        state: {
            date: selectedDate.toISOString().split('T')[0], 
            time: selectedTime,                             
            professionalId: professionalId                  
        }
    });
    const payload: ScheduleRequestDto = {
      consultationDate: dateStr,
      consultationTime: timeStr,
      consultationDescription: description || "Agendamento via Link",
      consultationCategoryId: 1,
      patientId: patientId,
      professionalUserId: professionalId,
    };

    try {
      await SchedulingRegisterApi(payload);
      alert("Consulta agendada com sucesso!");
      sessionStorage.removeItem("redirectAfterLogin");
      navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Erro ao agendar. Tente novamente.");
    }
  };

  if (loading) return <div className="pb-loading">Carregando...</div>;

  if (error)
    return (
      <div className="pb-error-container">
        <i
          className="bi bi-link-45deg"
          style={{ fontSize: "3rem", color: "#dc3545" }}
        ></i>
        <h2>Link Inválido</h2>
        <p>{error}</p>
      </div>
    );

  // --- TELA 1: GATE (LOGIN OU CADASTRO) ---
  if (step === "auth-gate") {
    return (
      <div className="pb-container">
        <div className="pb-card auth-card">
          <div className="doctor-avatar">
            <i className="bi bi-person-badge-fill"></i>
          </div>
          <h2>Agendar com Dr(a). {doctorName}</h2>
          <p className="expertise">{doctorExpertise}</p>

          <div className="divider"></div>

          <p className="instruction">
            Para acessar a agenda e marcar sua consulta, você precisa se
            identificar.
          </p>

          <div className="auth-actions">
            <button className="btn-login" onClick={handleGoToLogin}>
              Já tenho conta (Entrar)
            </button>
            <button className="btn-register" onClick={handleGoToRegister}>
              Não tenho cadastro (Criar Conta)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA 2: AGENDA (BOOKING) ---
  return (
    <div className="pb-container">
      <div className="pb-card">
        <div className="pb-header">
          <p>Agendamento com:</p>
          <h2>Dr(a). {doctorName}</h2>
          <span className="pb-badge">{doctorExpertise}</span>
        </div>

        <div className="pb-body">
          <div className="pb-form-group">
            <label>Data</label>
            <input
              type="date"
              className="pb-input"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="pb-form-group">
            <label>Horários Disponíveis</label>
            <div className="pb-slots-grid">
              {availableHours.length > 0 ? (
                availableHours.map((time) => (
                  <button
                    key={time}
                    className={`pb-slot ${
                      selectedTime === time ? "selected" : ""
                    }`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </button>
                ))
              ) : (
                <p className="text-muted" style={{ gridColumn: "1/-1" }}>
                  Nenhum horário disponível.
                </p>
              )}
            </div>
          </div>

          <div className="pb-form-group">
            <label>Observação</label>
            <textarea
              className="pb-input"
              rows={2}
              placeholder="Motivo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            className="pb-confirm-btn"
            onClick={handleConfirmBooking}
            disabled={!selectedTime}
          >
            Confirmar Agendamento
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientBooking;
