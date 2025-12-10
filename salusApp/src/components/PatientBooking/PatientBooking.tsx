import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { 
    GetProfessionalDataById, 
    GetProfessionalHoursAPI,
    SchedulingRegisterApi,
    type ScheduleRequestDto
} from "../../services/salusApi";
import { toastService } from "../../services/toastService";
import "./PatientBooking.css";

// Reutilizando interfaces ou definindo locais
interface ProfessionalData {
  occupation?: string;
  expertise?: string;
  professionalData?: {
    name?: string;
    cpf?: string;
    email?: string;
    gender?: string;
    phoneNumber?: string;
  };
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
                setProfessionalId(profId);
                
                const docResponse = await GetProfessionalDataById(profId);
                setDoctor(docResponse.data as ProfessionalData);
                setPatientId(sessionStorage.getItem("idPatient")!);
                
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
                toastService.handleApiError(err, "Erro ao carregar informações do agendamento");
                setError("Erro ao carregar dados");
            } finally {
                setLoading(false);
            }
        };

        validateAndFetch();
    }, []);

    const handleBooking = async () => {
        if (!patientId) {
            toastService.warning("Você precisa fazer login como paciente para agendar", "Aviso");
            sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
            navigate("/");
            return;
        }
        if (!selectedTime) {
            toastService.warning("Selecione um horário", "Aviso");
            return;
        }

        const dateStr = selectedDate.toISOString().split('T')[0];
        const timeStr = selectedTime.length === 5 ? `${selectedTime}:00` : selectedTime;

        const payload: ScheduleRequestDto = {
            consultationDate: dateStr,
            consultationTime: timeStr,
            consultationDescription: bookingNote || "Agendamento via Link",
            consultationCategoryId: 1, 
            patientId: patientId,
            professionalUserId: professionalId
        };

        try {
            await SchedulingRegisterApi(payload);
            toastService.success("Consulta agendada com sucesso!");
            navigate("/");
            sessionStorage.clear();
        } catch (err) {
            toastService.handleApiError(err, "Erro ao agendar consulta");
        }
    };
  const doctorName = doctor?.professionalData?.name || "Doutor(a)";

    return (
        <div className="patient-booking-container">
            <div className="doctor-header">
                <h2>Agendar Consulta</h2>
                <div className="doctor-info">
                    {/* <i className="bi bi-person-circle avatar"></i> */}
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