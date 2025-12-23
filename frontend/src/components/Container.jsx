import Navbar from "./Navbar"; 


function Container({children}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            <div className = "mx-auto max-w-5xl px-4 py-10" >
                {children}
            </div>
        </div>
    );
}
export default Container;
