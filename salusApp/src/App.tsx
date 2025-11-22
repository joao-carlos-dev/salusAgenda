import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Global.css'
import Login from './components/Login/Login';
import { RegisterForm } from './components/RegisterForm/RegisterForm';
import Scheduling from './components/Scheduling/scheduling';
import SchedulingProfessional from './components/SchedulingProfessional/schedulingProfessional';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/register' element={<RegisterForm/>} />
        <Route path='/scheduling' element={<Scheduling /> }/>
        <Route path ='/schedulingProfessional' element={<SchedulingProfessional />} />
      </Routes>
    </Router>
  )
}

export default App
