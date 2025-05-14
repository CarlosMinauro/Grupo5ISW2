import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import RecuperarContraseña from "./pages/RecuperarContraseña"
import RegisterPage from "./pages/RegisterPage"
import ConfirmationPage from "./pages/ConfirmationPage"
import App from "./pages/App"
import AppAdmin from "./pages/AppAdmin"

import './index.css'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename='/Proyecto-Progra-Web'>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-contraseña" element={<RecuperarContraseña />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        <Route path="/confirmation/*" element={<ConfirmationPage />} />
        <Route path="/app/*" element={<App />} />
        <Route path="/appadmin/*" element={<AppAdmin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)