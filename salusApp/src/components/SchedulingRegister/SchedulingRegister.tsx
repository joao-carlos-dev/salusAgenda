import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SchedulingRegisterApi,
  type ScheduleRequestDto,
} from "../../services/salusApi";
import { toastService } from "../../services/toastService";
import "./SchedulingRegister.css";

const SchedulingRegister = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. RECUPERA OS DADOS ENVIADOS PELA TELA ANTERIOR
  // Se não vier nada (acesso direto), esses valores serão undefined
  const { date, time, professionalId } = location.state || {};

  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [patientIdInput, setPatientIdInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. BUSCA DADOS E VALIDA ACESSO
  useEffect(() => {
    // Se faltar dados essenciais, volta para o início
    if (!date || !time || !professionalId) {
      toastService.warning(
        "Nenhum horário selecionado. Você será redirecionado.",
        "Aviso"
      );
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    // Preenche ID do paciente logado
    const savedData = sessionStorage.getItem("userData");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const id = parsed.id || parsed.userId || parsed.personalData?.id;
        if (id) setPatientIdInput(id);
      } catch (e) {
        toastService.error("Erro ao recuperar dados do usuário");
      }
    }
  }, [date, time, professionalId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Formatação de segurança para o Backend
    const formattedTime = time.length === 5 ? `${time}:00` : time;

    const payload: ScheduleRequestDto = {
      consultationDate: date, // Já deve vir YYYY-MM-DD do componente anterior
      consultationTime: formattedTime,
      consultationDescription: description,
      consultationCategoryId: Number(categoryId),
      patientId: patientIdInput,
      professionalUserId: professionalId, // Usa o ID recebido via state
    };

    try {
      console.log(" Enviando agendamento:", payload);
      await SchedulingRegisterApi(payload);

      toastService.success("Consulta agendada com sucesso!");

      // Limpa histórico e redireciona para Home ou Meus Agendamentos
      navigate("/home", { replace: true });
    } catch (error) {
      toastService.handleApiError(error, "Erro ao agendar consulta");
    } finally {
      setLoading(false);
    }
  };

  // Se não tiver dados, não renderiza nada (o useEffect vai redirecionar)
  if (!date || !time) return null;

  // Formatação visual da data para o usuário (PT-BR)
  const displayDate = new Date(date + "T00:00:00").toLocaleDateString("pt-BR");

  return (
    <div className="scheduling-container">
      <div className="scheduling-header">
        <h3>Confirmar Agendamento</h3>
      </div>

      {/* Resumo visual do que está sendo agendado */}
      <div className="scheduling-info">
        <div className="info-item">
          <i className="bi bi-calendar-event"></i>
          <span>{displayDate}</span>
        </div>
        <div className="info-item">
          <i className="bi bi-clock"></i>
          <span>{time}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Seu ID (Paciente)</label>
          <input
            type="text"
            required
            value={patientIdInput}
            readOnly // O paciente não deve mudar o próprio ID
            style={{ backgroundColor: "#f0f0f0", color: "#666" }}
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
            <option value="1">Consulta Padrão</option>
          </select>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-cancel"
          >
            Cancelar
          </button>
          <button type="submit" className="btn-confirm" disabled={loading}>
            {loading ? "Agendando..." : "Confirmar Agendamento"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchedulingRegister;
