import { Suspense } from "react"
import { Outlet } from "react-router-dom"

export const AdminContent: React.FC = () => {
    return (
        <main className='flex-grow' >
           <Suspense><Outlet /></Suspense>
        </main>
    )
}