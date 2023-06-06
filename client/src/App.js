import React from 'react';

// styling
import './assets/global.css';

// navigation components
import SidebarItem from "./components/navigation/SidebarItem"
import Logo from "./components/navigation/Logo"

// pages components
import Home from "./components/home/Home"
import Timer from "./components/timer/Timer"
import Profilo from "./components/profilo/Profilo"
import Todos from "./components/to-do/To-do"
import Gruppi from "./components/gruppi/GruppiDasboard"
import SaleStudio from "./components/saleStudio/SaleStudioDashboard"
import ResetPasswordForm from './components/recupera-password/RecuperoPasswordForm';
import TaskForm from './components/to-do/AccettazioneTaskForm';
import AccountConfirmation from './components/profilo/AccountConfirmation';
import EmailUpdateConfirmation from './components/profilo/profileModificationsModals/EmailUpdateCofirmation'

// routing elements
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";



function App() {
  return (
    <Router>
    <div className="main">
      <div className="sidebar">
      <Logo/>
        <div>
          <ul className='list-unstyled'>
            <li>
              <Link to="/home" style={{ textDecoration: 'none' }}>
                <SidebarItem title="HOME" icon="bi bi-house"/>
              </Link>
            </li>
            <li>
              <Link to="/profilo" style={{ textDecoration: 'none' }}>
                <SidebarItem title="PROFILO" icon="bi bi-person-circle"/>
              </Link>
            </li>
            <li>
              <Link to="/gruppi" style={{ textDecoration: 'none' }}>
                <SidebarItem title="GRUPPI" icon="bi bi-people-fill"/>
              </Link>
            </li>
            <li>
              <Link to="/to-do" style={{ textDecoration: 'none' }}>
              <SidebarItem title="TO-DO" icon="bi bi-clipboard-check"/>
              </Link>
            </li>
            <li>
              <Link to="/timer" style={{ textDecoration: 'none' }}>
                <SidebarItem title="TIMER" icon="bi bi-clock"/>
              </Link>
            </li>
            <li>
              <Link to="/sale-studio" style={{ textDecoration: 'none' }}>
              <SidebarItem title="SALE STUDIO" icon="bi bi-map"/>
              </Link>
            </li>
          </ul>
        </div>
      </div>


      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profilo" element={<Profilo />} />
        <Route path="/gruppi" element={<Gruppi />} />
        <Route path="/to-do" element={<Todos />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/sale-studio" element={<SaleStudio />} />
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path='/accept-reject-task/:token' element={<TaskForm />} />
        <Route path='/verifica-registrazione/:token' element={<AccountConfirmation />} />
        <Route path='/verifica-email/:token' element={<EmailUpdateConfirmation />} />

      </Routes>
    </div>
    </Router>
  );
}

export default App;
