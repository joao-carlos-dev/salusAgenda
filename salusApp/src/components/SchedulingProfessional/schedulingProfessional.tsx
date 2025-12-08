import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GenerateConsultationLinkApi,
  GetProfessionalDataById,
  GetProfessionalHoursAPI,
  UpdateProfessionalHoursAPI,
} from "../../services/salusApi";
import "./schedulingProfessional.css";

// --- INTERFACES ---
interface TokenPayload {
  sub: string;
  name?: string;
  [key: string]: unknown;
}

interface ProfessionalResponse {
  professionalData?: {
    name?: string;
    email?: string;
    occupation?: string;
    expertise?: string;
  };
  id?: string;
  name?: string;
  occupation?: string;
  expertise?: string;
}

interface Consultation {
  id: number;
  time: string;
  patientName: string;
  age: number;
  complaint: string;
}

// --- FUNÇÕES AUXILIARES DE DATA ---
const getLocalISODate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (time: string) => {
  if (!time) return "";
  return time.length > 5 ? time.substring(0, 5) : time;
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date(today);
dayAfter.setDate(today.getDate() + 2);

const mockSchedule: Record<string, Consultation[]> = {
  [getLocalISODate(today)]: [
    {
      id: 1,
      time: "08:30",
      patientName: "João Carlos Borges",
      age: 31,
      complaint: "Dores no corpo",
    },
    {
      id: 2,
      time: "10:00",
      patientName: "Maria Silva",
      age: 45,
      complaint: "Enxaqueca constante",
    },
  ],
  // AMANHÃ: Tem 1 consulta
  [getLocalISODate(tomorrow)]: [
    {
      id: 3,
      time: "09:00",
      patientName: "Pedro Alves",
      age: 28,
      complaint: "Check-up de rotina",
    },
  ],
  // DEPOIS DE AMANHÃ: Tem 2 consultas
  [getLocalISODate(dayAfter)]: [
    {
      id: 4,
      time: "14:00",
      patientName: "Ana Clara",
      age: 60,
      complaint: "Dores nas articulações",
    },
    {
      id: 5,
      time: "15:30",
      patientName: "Roberto Santos",
      age: 50,
      complaint: "Pressão alta",
    },
  ],
};

const SchedulingProfessional = () => {
  const [activeTab, setActiveTab] = useState("Dia");
  const [userId, setUserId] = useState("");

  const navigate = useNavigate();

  const [doctorName, setDoctorName] = useState("");
  const [doctorExpertise, setDoctorExpertise] = useState("");
  const [doctorOccupation, setDoctorOccupation] = useState("");

  // 1. ESTADO DA DATA SELECIONADA (Começa com hoje)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [configuredHours, setConfiguredHours] = useState<string[]>([]);

  // 2. FUNÇÕES DE NAVEGAÇÃO
  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };
  const formatDateDisplay = (date: Date) => {
    return date
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
      .replace(".", "");
  };

  const formatDateKey = (date: Date) => {
    return getLocalISODate(date);
  };

  const handleBlockHour = async (timeToRemove: string) => {
    if (!userId) return;

    if (
      !window.confirm(
        `Deseja remover o horário ${timeToRemove} da sua grade de atendimento?`
      )
    ) {
      return;
    }

    const newHoursList = configuredHours.filter(
      (h) => formatTime(h) !== timeToRemove
    );

    try {
      setConfiguredHours(newHoursList);

      await UpdateProfessionalHoursAPI(userId, newHoursList);
    } catch (error) {
      console.error("Erro ao remover horário:", error);
      alert("Erro ao atualizar a grade. Tente novamente.");
    }
  };

  const handleGenerateLink = async () => {
    if (!userId) return;
    try {
      const response = await GenerateConsultationLinkApi(userId);
      console.log("Link gerado:", response.data);
      const link = response.data.url;
       await navigator.clipboard.writeText(link);
      alert(
        `Link copiado para a área de transferência!\n\nEnvie para o paciente:\n${link}`
      );
    } catch (error) {
      console.error("Erro ao gerar link:", error);
      alert("Erro ao gerar link de agendamento.");
    }
  };

  useEffect(() => {
    const savedData = sessionStorage.getItem("userData");
    const token = sessionStorage.getItem("token");
    let currentId = "";
    let tokenName = "";
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        currentId =
          parsed.id ||
          parsed.userId ||
          parsed.user?.id ||
          parsed.personalData?.id;
        if (currentId) {
          setUserId(currentId);
        } else {
          console.warn("User ID not found in saved data.", parsed);
        }
      } catch (e) {
        console.error("Error parsing user data from sessionStorage:", e);
      }
    }
    const fetchData = async () => {
      try {
        const response = await GetProfessionalDataById(currentId);
        const data = response.data as ProfessionalResponse;
        if (data) {
          const pData = data.professionalData || {};
          const realName = pData.name || data.name || tokenName || "Doutor(a)";
          const realOccupation =
            pData.occupation || data.occupation || "Médico(a)";
          const realExpertise =
            pData.expertise || data.expertise || "Clínico Geral";
          setDoctorName(realName);
          setDoctorOccupation(realOccupation);
          setDoctorExpertise(realExpertise);
        }

        console.log("🕒 Buscando horários...");
        const responseHours = await GetProfessionalHoursAPI(currentId);
        console.log("📦 Resposta Horários:", responseHours.data);

        let hoursList: string[] = [];

        if (Array.isArray(responseHours.data)) {
          hoursList = responseHours.data;
        } else if (
          responseHours.data &&
          typeof responseHours.data === "object"
        ) {
          hoursList = Object.keys(responseHours.data);
        }

        if (hoursList.length > 0) {
          const sorted = hoursList.sort();
          setConfiguredHours(sorted);
          console.log("✅ Horários processados:", sorted);
        } else {
          console.warn("⚠️ Lista de horários vazia após processamento.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      }
    };

    fetchData();
  }, []);

  const linkDestino = userId
    ? `/updateprofessional/${userId}`
    : "/updateprofessional";

  const renderDailySlots = () => {
    if (configuredHours.length === 0) {
      return (
        <div className="notHours">
          <i className="bi bi-clock"></i>
          <p>Nenhum horário de atendimento configurado.</p>
          <Link to="/configure-hours">Configurar Grade</Link>
        </div>
      );
    }

    const dateKey = formatDateKey(selectedDate);

    const appointmentsToday = mockSchedule[dateKey] || [];

    return configuredHours.map((fullTime) => {
      const simpleTime = formatTime(fullTime);

      const appointment = appointmentsToday.find(
        (app) => app.time === simpleTime
      );

      if (appointment) {
        return (
          <div className="patientConsultation" key={fullTime}>
            <div className="patientHours">
              <span>{simpleTime}</span>
            </div>
            <div className="patientInformation">
              <h3>{appointment.patientName}</h3>
              <h3>{appointment.age} anos</h3>
              <p>{appointment.complaint}</p>
            </div>
            <button className="patientConsultationButton">
              Ficha Paciente
            </button>
          </div>
        );
      } else {
        return (
          <div className="patientConsultation" key={fullTime}>
            <div className="patientHours">
              <span>{simpleTime}</span>
            </div>
            <div className="patientInformation">
              <p>
                <i className="bi bi-calendar-plus"></i>
                Disponível
              </p>
            </div>

            <button
              className="buttonBlockHour"
              onClick={() => handleBlockHour(simpleTime)}
              title="Remover este horário da grade"
            >
              Liberar
            </button>
            <button className="buttonFreeHour">Livre</button>
          </div>
        );
      }
    });
  };

  return (
    <section className="containerSchedulingProfessional">
      <div className="header">
        <h2>Agenda</h2>

        <div className="scheduling">
          <ul>
            <li
              className={activeTab === "Dia" ? "active" : ""}
              onClick={() => setActiveTab("Dia")}
            >
              Dia
            </li>
            <li
              className={activeTab === "Semana" ? "active" : ""}
              onClick={() => setActiveTab("Semana")}
            >
              Semana
            </li>
            <li
              className={activeTab === "Mês" ? "active" : ""}
              onClick={() => setActiveTab("Mês")}
            >
              Mês
            </li>
          </ul>

          <div className="doctor-welcome">
            <h3 className="nameExpertise">
              {doctorName && doctorName.includes("@")
                ? doctorName
                : `Dr(a). ${doctorName}`}
            </h3>
            <span className="nameExpertise">
              {doctorExpertise}{" "}
              {doctorExpertise && doctorOccupation ? " | " : ""}{" "}
              {doctorOccupation}
            </span>
          </div>

          <div className="config">
            <Link to={linkDestino}>
              <i className="bi bi-person" title="Perfil"></i>
            </Link>

            <Link to="/configure-hours">
              <i
                className="bi bi-calendar-plus-fill"
                title="Configurar horários"
              ></i>
            </Link>

            <div>
              <i
                className="bi bi-box-arrow-right"
                title="Sair"
                onClick={handleLogout}
              ></i>
            </div>
            <i
              className="bi bi-share-fill"
              title="Gerar Link de Agendamento"
              onClick={handleGenerateLink}
              style={{ cursor: "pointer", color: "#007bff" }}
            ></i>
          </div>
        </div>
      </div>

      {activeTab === "Dia" && (
        <>
          <div className="dayLogout">
            <div className="schedulingDay">
              <div className="days">
                <button onClick={handlePrevDay}>
                  <i className="bi bi-arrow-left"></i>
                </button>
                <span>{formatDateDisplay(selectedDate)}</span>
                <button onClick={handleNextDay}>
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
          {renderDailySlots()}
        </>
      )}

      {activeTab === "Semana" && (
        <div className="weekScheduling" id="week">
          <div className="daysWeek">
            <div className="dayScheduling">
              <h4>Seg</h4>
              <h4>24</h4>
              <span className="info">
                <h4>08:30</h4>
                <h4>João Carlos</h4>
              </span>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Mês" && (
        <div style={{ textAlign: "center", padding: "20px" }}>Visão mensal</div>
      )}
    </section>
  );
};
export default SchedulingProfessional;
