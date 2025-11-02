import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Global.css'
import Login from './components/Login/Login';
import { RegisterForm } from './components/RegisterForm/RegisterForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path='/register' element={<RegisterForm/>} />
      </Routes>
    </Router>
  )
}

export default App
