import Home from "../../pages/Home"
import Footer from "../Common/Footer"
import Header from "../Common/Header"
import { Outlet } from "react-router-dom"


function UserLayout() {
    return (
        <>
            {/* Header */}
            <Header />
            {/* Main Content */}
            <Outlet />
            <main>
                <Home />
            </main>
            {/* Footer */}
            <Footer />
        </>
    )
}

export default UserLayout