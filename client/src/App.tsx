import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { Chat } from "./pages/Chat"
import { Register } from "./pages/Register"
import { NavBar } from "./components/NavBar/NavBar"


function App() {

  return (
    <>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </>
  )
}

export default App
