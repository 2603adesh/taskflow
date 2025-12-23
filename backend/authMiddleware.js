import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { decode } from "punycode";

dotenv.config();


export function authMiddleware(req, res , next){
    try{
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            res.status(401).json({
                messaage: "no authorization header"
            });
        }

        const token =  authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({
                message: "token not present"
            });
        }
        const decoded = jwt.verify(token , process.env.JWT_SECRET);

        req.user = {
            id : decoded.id,
            email : decoded.email
        };
        next();


    }
    catch(err){
        console.error("Auth error", err.message);
        return res.status(401).json({message : "token invalid or expired"});

    }

}