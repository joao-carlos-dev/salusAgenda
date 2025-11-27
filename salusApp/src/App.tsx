import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./Global.css";
import Login from "./components/Login/Login";
import { RegisterForm } from "./components/RegisterForm/RegisterForm";
import Scheduling from "./components/Scheduling/scheduling";
import SchedulingProfessional from "./components/SchedulingProfessional/SchedulingProfessional";
import { UpdateProfessional } from "./components/UpdateProfessional/UpdateProfessional";

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
        <Route
          path="/updateprofessional/:id"
          element={<UpdateProfessional />}
        />
        <Route path="/updateprofessional/" element={<UpdateProfessional />} />
      </Routes>
    </Router>
  );
}

export default App;
