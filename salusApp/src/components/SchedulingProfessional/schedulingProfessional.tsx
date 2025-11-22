import "./schedulingProfessional.css";
import { useState } from "react";

const SchedulingProfessional = () => {
  const [activeTab, setActiveTab] = useState("Dia");

  return (
    <section className="containerSchedulingProfessional">
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

        <div className="config">
          <i className="bi bi-gear"></i>
        </div>
      </div>


      {activeTab === "Dia" && (
        <>
          <div className="schedulingDay">
            <div className="days">
              <i className="bi bi-arrow-left"></i>
              <span>22 Nov, 2025</span>
              <i className="bi bi-arrow-right"></i>
            </div>
          </div>

          <div className="patientConsultaion">
            <div className="patientHours">
              <span>08:30</span>
            </div>

            <div className="patientInformation">
              <h3>João Carlos Borges</h3>
              <h3>31 anos</h3>

              <p>Dores no corpo</p>
            </div>
            <button>Ficha Paciente</button>
          </div>
        </>
      )}

      {activeTab === "Semana" && (
        <>
          <div className="weekScheduling" id="week">
            <div className="dayWeek">
              <div className="dayScheduling">
                <h4>Seg</h4>
                <h4>24</h4>

                <span className="info">
                  <h4>08:30</h4>
                  <h4>João Carlos</h4>
                </span>

                <span className="info">
                  <h4>09:30</h4>
                  <h4>João Carlos</h4>
                </span>

                <span className="info">
                  <h4>10:30</h4>
                  <h4>João Carlos</h4>
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default SchedulingProfessional;
