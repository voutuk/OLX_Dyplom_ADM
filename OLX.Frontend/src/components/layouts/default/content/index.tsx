import { Suspense } from "react"
import { Outlet } from "react-router-dom"

export const Content: React.FC = () => {
    return (
        <main className='flex-grow' >
           <Suspense><Outlet /></Suspense>
        </main>
    )
}