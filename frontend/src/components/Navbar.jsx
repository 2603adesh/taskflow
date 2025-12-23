import { Link , useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate()
    const token = localStorage.getItem("token");

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }

    return (
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            {/* App name */}
            <Link
              to="/dashboard"
              className="text-xl font-bold tracking-tight text-gray-900"
            >
              TaskFlow
            </Link>
    
            {/* Right side */}
            {token && (
              <button
                onClick={logout}
                className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-100"
              >
                Logout
              </button>
            )}
          </div>
        </header>
      );
}

export default Navbar;

