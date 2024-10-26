import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export const NavBar = () => {
    const { user, logoutUser } = useAuth();
    return (
        <div className="flex items-center justify-between bg-slate-500">
            <Link to="/" className="text-2xl font-bold m-4" >Chat</Link>
            {!user &&
                <div className="mr-4" >
                    <Link to="/login" className="  p-2 rounded-xl"> Login</Link>
                    <Link to="/register" className="  p-2 hover:bg-orange-300 rounded-xl"> Register</Link>
                </div>
            }
            {user &&
                <div className="mr-4" >
                    <Link to="/" className=" p-2 rounded-xl"> {user.name}</Link>
                    <Link to="/" onClick={logoutUser} className="  p-2 hover:bg-orange-300 rounded-xl"> Logout</Link>
                </div>}
        </div >
    )
}
