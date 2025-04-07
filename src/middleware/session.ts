import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.handle.js";
import { JwtPayload } from "jsonwebtoken";

interface RequestExt extends Request {
    user?: string | JwtPayload;
}

const checkJwt = (req: RequestExt, res: Response, next: NextFunction) => {
    try {
        const jwtByUser = req.headers.authorization || null;
        const jwt = jwtByUser?.split(' ').pop(); // ['Bearer', 'token'] -> 'token'
        console.log(jwt);
        const isUser = verifyToken(`${jwt}`);
        
        if (!isUser) {
            return res.status(401).send("NO_TIENES_UN_JWT_VALIDO");
        }
        
        req.user = isUser;
        next(); // Només si el token és vàlid, passa al següent middleware
    } catch (e) {
        console.error("Error en checkJwt:", e);
        return res.status(401).send("SESSION_NO_VALID");
    }
};

export { checkJwt };
