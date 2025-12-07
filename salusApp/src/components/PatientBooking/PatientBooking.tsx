import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ValidateConsultationLinkApi, 
    GetProfessionalDataById, 
    GetProfessionalHoursAPI,
    SchedulingRegisterApi,
    type ScheduleRequestDto
} from "../../services/salusApi";
import "./PatientBooking.css";

// Reutilizando interfaces ou definindo locais
interface ProfessionalData {
    name?: string;
    occupation?: string;
    expertise?: string;
    personalData?: { name?: string; }
}

const PatientBooking = () => {
    const { linkId } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [doctor, setDoctor] = useState<ProfessionalData | null>(null);
    const [professionalId, setProfessionalId] = useState("");
    const [availableHours, setAvailableHours] = useState<string[]>([]);
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState("");
    const [bookingNote, setBookingNote] = useState("");
    const [patientId, setPatientId] = useState(""); // Deve vir do login do paciente

    // 1. Valida o Link ao abrir a página
    useEffect(() => {
        const validateAndFetch = async () => {
            if (!linkId) return;
            try {
                // Valida o link e recebe o ID do profissional
                const response = await ValidateConsultationLinkApi(linkId);
                // Ajuste conforme seu DTO: response.data.professionalId ou direto
                const profId = response.data.professionalId || response.data; 
                setProfessionalId(profId);

                // Busca dados do médico
                const docResponse = await GetProfessionalDataById(profId);
                setDoctor(docResponse.data as ProfessionalData);

                // Busca horários do médico
                const hoursResponse = await GetProfessionalHoursAPI(profId);
                // Tratamento para array ou objeto
                let hours = [];
                if (Array.isArray(hoursResponse.data)) hours = hoursResponse.data;
                else if (typeof hoursResponse.data === 'object') hours = Object.keys(hoursResponse.data);
                
                setAvailableHours(hours.sort());

                // Verifica se o paciente está logado
                const savedData = sessionStorage.getItem("userData");
                if (savedData) {
                    const parsed = JSON.parse(savedData);
                    setPatientId(parsed.id || parsed.userId || "");
                }

            } catch (err) {
                console.error(err);
                setError("Este link de agendamento é inválido ou expirou.");
            } finally {
                setLoading(false);
            }
        };

        validateAndFetch();
    }, [linkId]);

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

        const payload: ScheduleRequestDto = {
            consultationDate: dateStr,
            consultationTime: timeStr,
            consultationDescription: bookingNote || "Agendamento via Link",
            consultationCategoryId: 1, // Padrão
            patientId: patientId,
            professionalUserId: professionalId
        };

        try {
            await SchedulingRegisterApi(payload);
            alert("Consulta agendada com sucesso!");
            navigate("/home"); // Redireciona para home do paciente
        } catch (err) {
            console.error(err);
            alert("Erro ao agendar consulta.");
        }
    };

    if (loading) return <div className="loading-screen">Validando link...</div>;
    if (error) return <div className="error-screen"><i className="bi bi-x-circle"></i> {error}</div>;

    const doctorName = doctor?.name || doctor?.personalData?.name || "Doutor(a)";

    return (
        <div className="patient-booking-container">
            <div className="doctor-header">
                <h2>Agendar Consulta</h2>
                <div className="doctor-info">
                    <i className="bi bi-person-circle avatar"></i>
                    <div>
                        <h3>Dr(a). {doctorName}</h3>
                        <span>{doctor?.expertise || "Médico"}</span>
                    </div>
                </div>
            </div>

            <div className="calendar-section">
                <label>Data:</label>
                <input 
                    type="date" 
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="slots-section">
                <label>Horários Disponíveis:</label>
                <div className="slots-grid">
                    {availableHours.length > 0 ? availableHours.map(time => {
                        const shortTime = time.substring(0, 5);
                        return (
                            <button 
                                key={time}
                                className={`slot-btn ${selectedTime === time ? 'active' : ''}`}
                                onClick={() => setSelectedTime(time)}
                            >
                                {shortTime}
                            </button>
                        )
                    }) : <p>Nenhum horário disponível.</p>}
                </div>
            </div>

            <div className="notes-section">
                <label>Observação (Opcional):</label>
                <textarea 
                    value={bookingNote}
                    onChange={(e) => setBookingNote(e.target.value)}
                    placeholder="Sente alguma dor? É retorno?"
                />
            </div>

            <button className="confirm-btn" onClick={handleBooking} disabled={!selectedTime}>
                Confirmar Agendamento
            </button>
        </div>
    );
};

export default PatientBooking;