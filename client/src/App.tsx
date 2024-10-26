import { Navigate, Route, Routes } from "react-router-dom"
import { Login } from "./pages/Login"
import { Chat } from "./pages/Chat"
import { Register } from "./pages/Register"
import { NavBar } from "./components/NavBar/NavBar"
import { useAuth } from "./context/AuthContext"


function App() {
  const { user } = useAuth();
  console.log('aspp', user);

  return (
    <>
      <NavBar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={user ? <Chat /> : <Login />} />
        <Route path="/login" element={user ? <Chat /> : <Login />} />
        <Route path="/register" element={user ? <Chat /> : <Register />} />
        <Route path="*" element={<Navigate to='/' />} />
      </Routes>
    </>
  )
}

export default App
