import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import GlobalFallback from "../../global_fallback"

export const Content: React.FC = () => {
    return (
        <main className='flex-grow' >
            <Suspense fallback={<GlobalFallback />}>
                <Outlet />
            </Suspense>
        </main>
    )
}