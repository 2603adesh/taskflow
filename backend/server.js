import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { authMiddleware } from "./authMiddleware.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js"


const app = express();
dotenv.config();
const port = process.env.PORT || 4000;

const allowedOrigins = ["http://localhost:5173",
    "https://taskflow-theta-eight.vercel.app",
];

app.use(cors({
    origin : function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);

        return callback(new Error("Not allowed by cors"));
    },
    credentials : true,
})
);
app.use(express.json());  //middleware

async function testDBconnection() {
    try{
        const result = await pool.query("SELECT NOW()");
        console.log("success!!", result.rows[0].now);

    }
    catch(err){   
        console.log("error", err.message)
    }
    
}

testDBconnection();





app.get("/api/health", (req, res) => {
    res.json(
        {
            status: "ok",
            message: "Taskflow backend running"
        }
    )
})
app.get("/auth/test", authMiddleware, (req,res) => {
    res.json({
        message : " protected route success",
        user : req.user
    })
}
)

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.listen(port , ()=> {
    console.log(`listening on port ${port} `)
});
