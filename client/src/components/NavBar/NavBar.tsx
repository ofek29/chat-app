import { Link } from "react-router-dom"

export const NavBar = () => {
    return (
        <div className="flex items-center justify-between bg-slate-500">
            <Link to="/" className="text-2xl font-bold m-4" >Chat</Link>
            <div className="mr-4" >
                <Link to="/login" className="  p-2 hover:bg-orange-300 rounded-xl"> Login</Link>
                <Link to="/register" className="  p-2 hover:bg-orange-300 rounded-xl"> Register</Link>
            </div>
        </div >
    )
}
