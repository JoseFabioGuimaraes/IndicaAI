export default function AuthLayout({ children, title }: { children: React.ReactNode, title: string }) {
    return (
        <div className="flex flex-col justify-center items-center gap-10 min-h-screen h-screen w-full overflow-y-auto py-20">
            {/* <img src="/indica-ai.svg" alt="" className="w-20 h-20" /> */}
            <h1 className="text-primary text-4xl text-center font-bold">{ title }</h1>
            { children }
        </div>
    )
}