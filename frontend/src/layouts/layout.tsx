import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

//descirbes the props this component expects
interface Props {
    children: React.ReactNode;  //since we want to accept components
}
const Layout = ({children}: Props) => {
    return (
        //Ensures the div takes up the whole screen, keep header and footer fixed
        <div className="flex flex-col min-h-screen">
            <Header/>
            <Hero/>
            <div className="container mx-auto py-10 flex-1">
                {children}
            </div>
            <Footer/>
        </div>
    )
}

export default Layout;