import { Request, Response } from "express";
import { registerNewUser, loginUser, googleAuth } from "../auth/auth_service.js";
import { generateTokens } from "../../utils/jwt.handle.js";
import User from "../users/user_models.js";
import jwt from "jsonwebtoken"; // Importació correcta de jsonwebtoken

const JWT_SECRET = process.env.JWT_SECRET || "token.010101010101"; // Defineix el secret del JWT

const registerCtrl = async ({ body }: Request, res: Response) => {
    try {
        const responseUser = await registerNewUser(body);
        res.json(responseUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

const loginCtrl = async ({ body }: Request, res: Response) => {
    try {
        const { name, email, password } = body;
        const responseUser = await loginUser({ name, email, password });

        if (responseUser === 'INCORRECT_PASSWORD') {
            return res.status(403).json({ message: 'Contrasenya incorrecta' });
        }

        if (responseUser === 'NOT_FOUND_USER') {
            return res.status(404).json({ message: 'Usuari no trobat' });
        }

        return res.json(responseUser);
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

const googleAuthCtrl = async (req: Request, res: Response) => {
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URL;
    if (!redirectUri) {
        console.error("ERROR: GOOGLE_OAUTH_REDIRECT_URL no està definida a .env");
        return res.status(500).json({ message: "Error intern de configuració" });
    }
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'; 
    const options = new URLSearchParams({
        redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL!,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
    });
    const fullUrl = `${rootUrl}?${options.toString()}`;
    console.log("Redirigint a:", fullUrl);
    res.redirect(fullUrl);
};

const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        const code = req.query.code as string;

        if (!code) {
            return res.status(400).json({ message: 'Codi d’autorització faltant' });
        }

        const authData = await googleAuth(code);

        if (!authData) {
            return res.redirect('/login?error=authentication_failed');
        }

        console.log(authData.token);
        // Configurar cookies no https (secure) --> accés des del web.
        res.cookie('token', authData.token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 86400000 // 1 dia
        });
        console.log(authData.token);
        res.redirect(`http://localhost:4200/?token=${authData.token}`);
    } catch (error: any) {
        console.error('Error en el callback de Google:', error);
        res.redirect('/login?error=server_error');
    }
};

export const refreshTokenCtrl = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "El refresh token és obligatori" });
    }

    try {
        const decoded: any = jwt.verify(refreshToken, JWT_SECRET); // Ús correcte de jwt.verify
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Refresh token no vàlid" });
        }

        const tokens = generateTokens(user._id.toString());
        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (error) {
        res.status(403).json({ message: "Refresh token caducat o no vàlid" });
    }
};

export { registerCtrl, loginCtrl, googleAuthCtrl, googleAuthCallback };