import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();
function generateToken(user){
    return jwt.sign( 
        { id: user.id, email : user.email },
         process.env.JWT_SECRET ,
         { expiresIn : process.env.JWT_EXPIRES_IN || "7d" }
        );
}


router.post("/register", async (req, res) => {
    try{
    const { name , email , password } = req.body;
    if ( !name || !email || !password ){
        return res.status(400).json({message : "Name, email and password field required"});
    }

    const check = await pool.query("SELECT id FROM users where email = $1", [email]);
    if (check.rows.length > 0){
        return res.status(409).json({message: "email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
        `INSERT INTO users(name, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id, name, email, created_at`,
        [name, email, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({message : "user registeres successfully", user , token } );

}  catch (err){
    console.error("error", err.message);
    res.status(500).json({ message : "server error" });
}
});


router.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body;

        if ( !email || !password ){
            return res.status(400).json({message : "Please enter Email and password"})
        }

        const result = await pool.query("SELECT id, name , email , password_hash FROM USERS WHERE email = $1", 
            [email]
        );

        if (result.rows.length === 0){
            return res.status(401).json({message : "Invalid email or password" });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({message : "Invalid email or password"});
        }
    const token = generateToken(user);

    delete user.password_hash;

    return res.json({
        message: "logged in successfully",
        user,
        token
    });

    } catch(err){
        console.error("error in login", err.message);
        return res.status(500).json({ message : "error" });
    }

});

export default router;