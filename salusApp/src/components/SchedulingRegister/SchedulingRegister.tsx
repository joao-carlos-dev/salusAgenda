import { useState, useEffect } from "react";
import { SchedulingRegisterApi, type ScheduleRequestDto } from "../../services/salusApi";
import "./SchedulingRegister.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  time: string;
  professionalId: string;
  onSuccess: () => void;
}

const SchedulingRegister = ({isOpen, onClose, date, time, professionalId, onSuccess }: Props) => {
const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1); // 1 como padrão
  const [patientIdInput, setPatientIdInput] = useState("");
  const [loading, setLoading] = useState(false);
    useEffect(() => {
    if (isOpen) {
        const savedData = sessionStorage.getItem("userData");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Se quem está logado é paciente, o ID dele estará aqui
                const id = parsed.id || parsed.userId || parsed.personalData?.id;
                if (id) setPatientIdInput(id);
            } catch {
                console.log("")
            }
        }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Formata data YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Garante formato de hora
    const formattedTime = time.length === 5 ? `${time}:00` : time;

    const payload: ScheduleRequestDto = {
        consultationDate: formattedDate,
        consultationTime: formattedTime,
        consultationDescription: description,
        consultationCategoryId: Number(categoryId),
        patientId: patientIdInput, // O ID de quem vai ser atendido
        professionalUserId: professionalId
    };

    try {
        console.log("🚀 Enviando agendamento:", payload);
        await SchedulingRegisterApi(payload);
        alert("Consulta agendada com sucesso!");
        onSuccess(); // Recarrega a agenda
        onClose();   // Fecha modal
    } catch (error) {
        console.error("Erro ao agendar:", error);
        alert("Erro ao realizar agendamento. Verifique os dados.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Agendar Consulta</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <div className="modal-info">
            <p><i className="bi bi-calendar-event"></i> {date.toLocaleDateString()}</p>
            <p><i className="bi bi-clock"></i> {time}</p>
        </div>

        <form onSubmit={handleSubmit}>
            {/* Se for médico agendando, ele precisa digitar o ID do paciente. 
                Se for paciente logado, isso já vem preenchido mas pode ficar oculto ou readonly */}
            <div className="form-group">
                <label>ID do Paciente</label>
                <input 
                    type="text" 
                    required 
                    value={patientIdInput}
                    onChange={(e) => setPatientIdInput(e.target.value)}
                    placeholder="UUID do paciente"
                />
            </div>

            <div className="form-group">
                <label>Motivo / Descrição</label>
                <textarea 
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Dores de cabeça frequentes..."
                    rows={3}
                />
            </div>

            <div className="form-group">
                <label>Categoria</label>
                <select 
                    value={categoryId} 
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                </select>
            </div>

            <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-confirm" disabled={loading}>
                    {loading ? "Agendando..." : "Confirmar Agendamento"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}

export default SchedulingRegister;
