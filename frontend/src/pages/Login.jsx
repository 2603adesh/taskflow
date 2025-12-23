import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Container from "../components/Container";



function Login(){

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            const res =  await api.post("/auth/login", {email, password});
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            console.log("login success", res.data);

            navigate("/dashboard");

        } catch(err){
            console.log("LOGIN FAILED:", err?.response?.data || err.message);
            const msg = err?.response?.data?.message || err.message || "login failed";
            setError(msg);

            
        } finally {
            setLoading(false);
        }
    }

    return ( <Container>
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold"> Login Page </h2>
        <p className="mt-1 text-sm text-gray-600">Welcome Back - sign in to manage your tasks</p>

        {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-100">
            {error}
            </p>
      )}

        <form onSubmit= {handleSubmit} className="mt-6 space-y-4">

            <div>
            <label className="text-sm font-medium">Email</label>
            <input 
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-100"
            type="email" placeholder="Email" value={email} onChange = { (e) => {
                setEmail(e.target.value)
            }} 
            required
            />
            </div>

            <div>
            <label className="text-sm font-medium">Password</label>
            <input 
            className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-100"
            type="password" placeholder="Password" value={password} onChange = { (e) => {
                setPassword(e.target.value)
            }} 
            required
            />
            </div>

            <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-60">
                {loading ? "Logging in " : "Login"}
            </button>

        </form>
        <p className="mt-4 text-sm text-gray-600">
                Don't have an account? <Link className="font-semibold text-gray-900 underline" to = "/register">Register</Link>
            </p>

    </div>
    </Container>
    );
}

export default Login;