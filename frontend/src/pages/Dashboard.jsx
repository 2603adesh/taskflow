import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Container from "../components/Container";
function Dashboard(){
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [creating, setCreating] = useState(false);
    const [loadingTasks, setLoadingTasks] = useState(false);
    const [error, setError] = useState("");

    const [tasks, setTasks] = useState([]);


    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, [])
    async function fetchTasks() {

        setError("");
        setLoadingTasks(true);

        try{
            const res = await api.get("/tasks");
            setTasks(res.data);
            
        } catch(err){
            const msg = err?.response?.data?.message || err.message || "failed to fetch tasks";
            setError(msg);
        } finally {
            setLoadingTasks(false);
        }
    }

    useEffect(() => {
        fetchTasks();
    }, []);

    async function deleteTask(taskId) {
        const ok = window.confirm("do you want to delete this task");
        if (!ok) {
            return;
        }
        try {
            await api.delete(`/tasks/${taskId}`);
            await fetchTasks();
        }
        catch(err) {
            alert("failed to delete task");
        }
    }



    async function handleCreateTask(e){
        e.preventDefault();
        setError("");
        
         if (!title.trim()) {
            setError("Title is requires");
            return;
         }

         setCreating(true);

         try {
        const res = await api.post("/tasks", { title : title.trim(), description : description.trim() || null });

        
        setTitle("");
        setDescription("");

        await fetchTasks();

         } catch(err) {
            const msg = err?.response?.data?.message || err.message || "failed to create task";
            setError(msg);
         } finally {
            setCreating(false);
         }
    }

    async function toggleStatus(task) {

        try {
        const newStatus = task.status == "done"? "todo" : "done";


        await api.put(`/tasks/${task.id}`, {status : newStatus});
        await fetchTasks();
        } catch(err) {
            alert("failed to update status")
        }


        
    }

    function logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    }



    return (
        <Container>
          <div className="flex flex-col items-center text-center">
            <div>
              <h2 className="text-3xl font-bold">Dashboard</h2>
              <p className="mt-1 text-sm text-gray-600">
                Logged in as <span className="font-semibold text-gray-900">{user?.email || "..."}</span>
              </p>
            </div>
          </div>
      
          <div className="mt-8 grid gap-6">
            {/* Create Task */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Create Task</h3>
                <button
                  onClick={fetchTasks}
                  disabled={loadingTasks}
                  className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-100 disabled:opacity-60"
                >
                  {loadingTasks ? "Refreshing..." : "Refresh"}
                </button>
              </div>
      
              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
      
              <form onSubmit={handleCreateTask} className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                    type="text"
                    placeholder="e.g., Finish TaskFlow UI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
      
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Optional notes…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
      
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-gray-900 px-4 py-2 font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Add Task"}
                </button>
              </form>
            </div>
      
            {/* Task List */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Your Tasks</h3>
      
              {loadingTasks ? (
                <p className="mt-4 text-gray-600">Loading tasks…</p>
              ) : tasks.length === 0 ? (
                <p className="mt-4 text-gray-600">No tasks yet. Create your first one above.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {tasks.map((t) => (
                    <li
                      key={t.id}
                      className={`rounded-2xl border p-4 ${
                        t.status === "done" ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div
                            className={`text-base font-bold ${
                              t.status === "done" ? "line-through text-gray-600" : "text-gray-900"
                            }`}
                          >
                            {t.title}
                          </div>
      
                          {t.description && (
                            <div className="mt-1 text-sm text-gray-700">{t.description}</div>
                          )}
      
                          <div className="mt-2 text-xs text-gray-500">
                            status: {t.status} • priority: {t.priority}
                          </div>
                        </div>
      
                        <div className="flex shrink-0 flex-col gap-2">
                          <button
                            onClick={() => toggleStatus(t)}
                            className="rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-gray-100"
                          >
                            {t.status === "done" ? "Mark Todo" : "Mark Done"}
                          </button>
      
                          <button
                            onClick={() => deleteTask(t.id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Container>
      );
      
}

export default Dashboard;