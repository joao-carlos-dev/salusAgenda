import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GetProfessionalHoursAPI, UpdateProfessionalHoursAPI } from "../../services/salusApi";
import { toastService } from "../../services/toastService";
import "./configureHours.css";

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

const TIME_SLOTS = generateTimeSlots();

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
        toastService.error("Erro ao ler dados do usuário");
      }
    }

    const fetchHours = async () => {
      if (!currentId) return;
      try {
        const response = await GetProfessionalHoursAPI(currentId);

        let hoursList: string[] = [];

        if (response.data && Array.isArray(response.data.hours)) {
          hoursList = response.data.hours;
        } else if (Array.isArray(response.data)) {
          hoursList = response.data;
        } else if (response.data && typeof response.data === "object") {
          hoursList = Object.keys(response.data);
        }

        const formattedList = hoursList.map((h) => h.substring(0, 5));
        setSelectedHours(formattedList);
      } catch (error) {
        toastService.handleApiError(error, "Erro ao carregar horários atuais");
      }
    };

    fetchHours();
  }, []);

  // const generateTimeSlots = () => {
  //   const slots = [];
  //   const startHour = 7;
  //   const endHour = 19;

  //   for (let hour = startHour; hour <= endHour; hour++) {
  //     slots.push(`${hour.toString().padStart(2, "0")}:00`);
  //     slots.push(`${hour.toString().padStart(2, "0")}:30`);
  //   }
  //   return slots;
  // };

  // const timeSlots = generateTimeSlots();

  const toggleHour = (time: string) => {
    if (selectedHours.includes(time)) {
      setSelectedHours(selectedHours.filter((h) => h !== time));
    } else {
      setSelectedHours([...selectedHours, time].sort());
    }
  };

  const handleSave = async () => {
    if (!userId) {
      toastService.error("Erro: ID do usuário não encontrado");
      return;
    }

    const formattedHours = selectedHours.map((h) =>
      h.length === 5 ? `${h}:00` : h
    );

    setLoading(true);
    try {
      await UpdateProfessionalHoursAPI(userId, formattedHours);
      toastService.success("Horários de atendimento atualizados com sucesso!");
    } catch (error) {
      toastService.handleApiError(error, "Erro ao salvar horários");
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
        {TIME_SLOTS.map((time) => (
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
