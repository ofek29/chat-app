import { useAuth } from "../context/AuthContext";

export const Login = () => {

    const { loginUser, isLoginLoading, updateLoginInfo, loginError } = useAuth();

    return (
        <div className="justify-center flex bg-neutral-400 h-dvh ">
            <form onSubmit={loginUser}
                className="w-80  gap-8 flex flex-col justify-center ">
                <h1 className=" text-xl text-center">Sign In</h1>

                <input type="email"
                    name="email"
                    onChange={(e) =>
                        updateLoginInfo(e.target.name, e.target.value)}
                    placeholder="Email" />

                <input type="password"
                    name="password"
                    onChange={(e) =>
                        updateLoginInfo(e.target.name, e.target.value)}
                    placeholder="Password" />

                <button
                    type="submit"
                    className="rounded-lg bg-slate-500 hover:bg-orange-300">
                    {isLoginLoading ? 'loading' : 'Login'}
                </button>

                {loginError?.error &&
                    <div className="text-red-500">
                        <p>{loginError?.message}</p>
                    </div>}
            </form>
        </div >
    )
}
