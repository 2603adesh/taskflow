import express from "express";
import dotenv from "dotenv";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../authMiddleware.js";


const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try{
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, title, description, status, priority, due_date, created_at
            FROM tasks
            WHERE user_id = $1
            ORDER BY created_at DESC`,
            [userId]);
        res.json(result.rows);
    }
    catch(err){
        console.error("error in get task", err.message);
        res.status(500).json({message : "server error"});
    }
});


router.post("/", authMiddleware, async (req, res) => {
    try{
        const userId = req.user.id;
        const { title, description, status, priority, due_date } = req.body;

        if (!title) {
            return res.status(400).json({ message : "title is required" });
        }

        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
            VALUES ($1 , $2, $3, $4, $5, $6)
            RETURNING id, title, description, status, priority, due_date, created_at`,
            [
                userId,
                title,
                description || null,
                status || 'todo',
                priority || 2,
                due_date || null
            ]
        );
        res.status(201).json(result.rows[0]);
    }

catch(err){
    console.log("error in creating task", err.message);
    res.status(500).json( { message : "error creating task" })
}
})

router.put("/:id", authMiddleware, async (req, res) => {
    try{
        const userId = req.user.id;
        const taskId = Number(req.params.id);

        const { title , description, status, priority , due_date } = req.body;

        if (!Number.isInteger(taskId)) {
            return res.status(400).json({ message : "Invalid Task Id" })
        }


        const result = await pool.query(`
            UPDATE tasks 
            SET 
             title = COALESCE( $1, title),
             description = COALESCE( $2, description),
             status = COALESCE( $3, status),
             priority = COALESCE( $4, priority),
             due_date = COALESCE( $5, due_date)
             WHERE id = $6 AND user_id = $7
             RETURNING title, description, status, priority, due_date`,
            [title ?? null,
                description ?? null,
                status ?? null,
                priority ?? null,
                due_date ?? null,
                taskId,
                userId
            ])

        if (result.rows.length == 0){
            return res.status(404).json({ mesasge : "task not found" })
        }

        res.json(result.rows[0]);

    } catch(err){
        console.log("error in updating tasks", err.message);
        res.status(500).json( { message : "server error" })
    }
})

router.delete("/:id", authMiddleware,  async (req, res) => {
    try{
    const userId = req.user.id;
    const taskId = Number(req.params.id);

    if (!Number.isInteger(taskId)) {
        return res.status(400).json({ message : "Task Id should be a no"});
    }

    const result = await pool.query(`
        DELETE
        FROM tasks
        WHERE id = $1 AND user_id = $2
        RETURNING id`,
    [taskId,
        userId
    ]);

    if(result.rows.length == 0){
        return res.status(404).json({ message : "task not found" });
    }

    res.json({ message : "task deleted successfully" });
    } catch(err) {
        console.log("error in task deletion", err.message);
        res.status(500).json({ message : "server error"})
    }

})


export default router;