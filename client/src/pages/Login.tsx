
export const Login = () => {
    return (
        <div className="justify-center flex bg-neutral-400 h-dvh ">
            <form className="w-80  gap-8 flex flex-col justify-center ">
                <h1 className=" text-xl text-center">Sign In</h1>

                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit" className="rounded-lg bg-slate-500 hover:bg-orange-300">Login</button>

            </form>
        </div >
    )
}
