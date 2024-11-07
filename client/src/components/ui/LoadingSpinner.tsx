type LoadingTextProps = {
    text?: string
}
export const LoadingSpinner = ({ text }: LoadingTextProps) => (
    <div className="w-[50%] top-[50%] flex flex-col items-center justify-center">

        <div className=" transition-transform duration-500 transform scale-50 opacity-50 delay-200 animate-opacity">
            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className=" text-xl ">{text}</p>
    </div>
);