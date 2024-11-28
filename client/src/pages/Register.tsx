import { useAuth } from "../context/AuthContext/useAuth"

export const Register = () => {

    const { registerUser, isRegisterLoading, updateRegisterInfo, registerError } = useAuth();

    return (
        <div className="bg-[#0c1821] h-[calc(100vh-4rem)] flex justify-center items-center">
            <div className="w-[35%] h-[50%] min-w-[400px] bg-[#1b2a41] text-white rounded-2xl border-gray-500 border-[0.5px] justify-center flex">

                <form onSubmit={registerUser}
                    className="w-2/3  gap-8 flex flex-col justify-center al ">
                    <h1 className=" text-xl text-center">Sign Up</h1>

                    <input type="text"
                        name="name"
                        className="text-black rounded-sm bg-slate-300"
                        onChange={(e) =>
                            updateRegisterInfo(e.target.name, e.target.value)}
                        placeholder="Name" />

                    <input type="email"
                        name="email"
                        className="text-black rounded-sm bg-slate-300"
                        onChange={(e) =>
                            updateRegisterInfo(e.target.name, e.target.value)}
                        placeholder="Email" />

                    <input type="password"
                        name="password"
                        className="text-black rounded-sm bg-slate-300"
                        onChange={(e) =>
                            updateRegisterInfo(e.target.name, e.target.value)}
                        placeholder="Password" />

                    <button
                        type="submit"
                        className="rounded-lg bg-[#778DA9] hover:bg-[#BCBDB3]">
                        {isRegisterLoading ? 'loading' : 'Register'}
                    </button>

                    {registerError?.error &&
                        <div className="text-red-500">
                            <p>{registerError?.message}</p>
                        </div>}
                </form>
            </div >
        </div >
    )
}