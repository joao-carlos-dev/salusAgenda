import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { 

    GetProfessionalDataById, 
    GetProfessionalHoursAPI,
    SchedulingRegisterApi,
    type ScheduleRequestDto
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
    
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [doctor, setDoctor] = useState<ProfessionalData | null>(null);
    const [professionalId, setProfessionalId] = useState("");
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingNote, setBookingNote] = useState("");
    const [patientId, setPatientId] = useState(""); 

    useEffect(() => {
        const validateAndFetch = async () => {
            try {
                const profId = sessionStorage.getItem("profId")!;
                const docResponse = await GetProfessionalDataById(profId);
                setDoctor(docResponse.data as ProfessionalData);
                setPatientId(sessionStorage.getItem("idPatient")!)
                const hoursResponse = await GetProfessionalHoursAPI(profId);
                
                let hours = [];
                if (Array.isArray(hoursResponse.data)) hours = hoursResponse.data;
                else if (typeof hoursResponse.data === 'object') hours = Object.keys(hoursResponse.data);
                
                setAvailableHours(hours.sort());

                const savedData = sessionStorage.getItem("userData");
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setPatientId(parsed.id || parsed.userId || "");
                }

            } catch (err) {
                console.error(err);
                setError("Erro ao agendar consulta, tente novamente mais tarde!.");
            } finally {
                setLoading(false);
            }
        };

        validateAndFetch();
    }, []);

    const handleBooking = async () => {
        if (!patientId) {
            alert("Você precisa fazer login como paciente para agendar.");
            // Salva a URL para voltar depois do login
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            navigate("/"); // Vai para login
            return;
        }
        if (!selectedTime) {
            alert("Selecione um horário.");
            return;
        }

        const dateStr = selectedDate.toISOString().split('T')[0];
        const timeStr = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

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
            navigate("/"); // Redireciona para home do paciente
        } catch (err) {
            console.error(err);
            alert("Erro ao agendar consulta.");
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
