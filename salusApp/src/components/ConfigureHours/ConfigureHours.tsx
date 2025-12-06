import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetProfessionalHoursAPI, UpdateProfessionalHoursAPI } from "../../services/salusApi";
import "./configureHours.css";

const ConfigureHours = () => {
  const [selectedHours, setSelectedHours] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const savedData = sessionStorage.getItem("userData");
    let currentId = "";
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        currentId = parsed.id || parsed.userId || parsed.personalData?.id;
        if (currentId) setUserId(currentId);
      } catch (e) {
        console.error("Erro ao ler ID", e);
      }
    }

    const fetchHours = async () => {
      if (!currentId) return;
      try {
        const response = await GetProfessionalHoursAPI(currentId);
        console.log("Horários carregados:", response.data);

        let hoursList: string[] = [];

        // Tratamento flexível da resposta (Array ou Objeto)
        if (response.data && Array.isArray(response.data.hours)) {
          hoursList = response.data.hours;
        } else if (Array.isArray(response.data)) {
          hoursList = response.data;
        } else if (response.data && typeof response.data === "object") {
          hoursList = Object.keys(response.data);
        }

        // Formata para HH:mm (remove segundos se houver) para bater com os botões
        const formattedList = hoursList.map((h) => h.substring(0, 5));

        setSelectedHours(formattedList);
      } catch (error) {
        console.error("Erro ao carregar horários atuais:", error);
      }
    };

    fetchHours();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 7;
    const endHour = 19;

    for (let hour = startHour; hour <= endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleHour = (time: string) => {
    if (selectedHours.includes(time)) {
      setSelectedHours(selectedHours.filter((h) => h !== time));
    } else {
      setSelectedHours([...selectedHours, time].sort());
    }
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Erro: ID do usuário não encontrado.");
      return;
    }

    const formattedHours = selectedHours.map((h) =>
      h.length === 5 ? `${h}:00` : h
    );

    setLoading(true);
    try {
      console.log("Enviando horários:", formattedHours);

      await UpdateProfessionalHoursAPI(userId, formattedHours);

      alert("Horários de atendimento atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      alert("Ocorreu um erro ao salvar os horários.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="config-hours-container">
      <div className="config-header">
        <Link to="/schedulingProfessional" className="back-link">
          <i className="bi bi-arrow-left"></i> Voltar
        </Link>
        <h2>Configurar Horários</h2>
        <p>
          Selecione os horários que você estará disponível para atendimento.
        </p>
      </div>

      <div className="hours-grid">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`time-slot ${
              selectedHours.includes(time) ? "selected" : ""
            }`}
            onClick={() => toggleHour(time)}
          >
            {time}
            {selectedHours.includes(time) && (
              <i className="bi bi-check-circle-fill"></i>
            )}
          </button>
        ))}
      </div>

      <div className="config-footer">
        <div className="summary">
          <strong>{selectedHours.length}</strong> horários selecionados
        </div>
        <button className="save-btn" onClick={handleSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar Disponibilidade"}
        </button>
      </div>
    </section>
  );
};

export default ConfigureHours;
