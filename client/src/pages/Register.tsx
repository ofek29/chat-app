import { useAuth } from "../context/AuthContext"

export const Register = () => {

    const { registerInfo, registerUser, isRegisterLoading, updateRegisterInfo, registerError } = useAuth();

    return (
        <div className="justify-center flex bg-neutral-400 h-dvh ">
            <form onSubmit={registerUser}
                className="w-80  gap-8 flex flex-col justify-center al ">
                <h1 className=" text-xl text-center">Sign Up</h1>

                <input type="text"
                    name="name"
                    value={registerInfo?.name}
                    onChange={(e) =>
                        updateRegisterInfo(e.target.name, e.target.value)}
                    placeholder="Name" />

                <input type="email"
                    name="email"
                    // value={registerInfo?.email}
                    onChange={(e) =>
                        updateRegisterInfo(e.target.name, e.target.value)}
                    placeholder="Email" />

                <input type="password"
                    name="password"
                    value={registerInfo?.password}
                    onChange={(e) =>
                        updateRegisterInfo(e.target.name, e.target.value)}
                    placeholder="Password" />

                <button
                    type="submit"
                    className="rounded-lg bg-slate-500 hover:bg-orange-300">
                    {isRegisterLoading ? 'loading' : 'Register'}
                </button>

                {registerError?.error &&
                    <div className="text-red-500">
                        <p>{registerError?.message}</p>
                    </div>}
            </form>
        </div >
    )
}