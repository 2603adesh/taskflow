import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Container from "../components/Container";



function Register(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res =  await api.post("/auth/register", { name, email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            console.log("registration success", res.data);

            navigate("/dashboard");

        } catch(err){
            console.log("REGISTER FAILED:", err?.response?.data || err.message);
            const msg = err?.response?.data?.message || err.message || "register failed";
            setError(msg);

            
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container>
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Register</h2>
            <p className="mt-1 text-sm text-gray-600">
              Create an account to start using TaskFlow.
            </p>
      
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
      
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                  type="text"
                  placeholder="Adesh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
      
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                  type="email"
                  placeholder="adesh@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
      
              <div>
                <label className="text-sm font-medium">Password</label>
                <input
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
      
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </form>
      
            <p className="mt-4 text-sm text-gray-600">
              Already have an account?{" "}
              <Link className="font-semibold text-gray-900 underline" to="/login">
                Login
              </Link>
            </p>
          </div>
        </Container>
      );
      
}

export default Register;