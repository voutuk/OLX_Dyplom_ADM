import { Suspense } from "react"
import { Outlet } from "react-router-dom"
import GlobalFallback from "../../../components/global_fallback"

export const AdminContent: React.FC = () => {
    return (
        <main className='flex-grow' >
            <Suspense fallback={<GlobalFallback />}>
                <Outlet />
            </Suspense>
        </main>
    )
}