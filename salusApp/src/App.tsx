import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Global.css'
import Login from './components/Login/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  )
}

export default App
