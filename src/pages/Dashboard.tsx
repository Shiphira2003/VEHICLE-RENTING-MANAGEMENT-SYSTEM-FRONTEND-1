
import Footer  from "../components/Footer";
import { Navbar } from "../components/Navbar";

import { Layout } from "../dashboardDesign/Layout";

export default function Dashboard() {
    return (
        <div className="h-screen">
            <Navbar/>
            <Layout />
            <Footer/>
        </div>

    );
} 