import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Global.css";
import Login from "./components/Login/Login";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";
import Scheduling from "./components/Scheduling/scheduling";
import SchedulingProfessional from "./components/SchedulingProfessional/SchedulingProfessional";
import ConfigureHours from "./components/ConfigureHours/ConfigureHours";
import { RegisterFormPatient } from "./components/RegisterFormPatient/RegisterFormPatient";
import PatientBooking from "./components/PatientBooking/PatientBooking";
// import SchedulingRegister from "./components/SchedulingRegister/SchedulingRegister";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/scheduling" element={<Scheduling />} />
        <Route
          path="/schedulingprofessional"
          element={<SchedulingProfessional />}
        />
        <Route path="/configure-hours" element={<ConfigureHours />} />
        <Route path="/registerpatient/:linkId" element={<RegisterFormPatient />} />
        {/* <Route path="/schedulingregister" element={<SchedulingRegister />} /> */}
        <Route path="/agendar" element={<PatientBooking/>} />
      </Routes>
    </Router>
  );
}

export default App;
