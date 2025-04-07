import pkg from "jsonwebtoken";
const { sign, verify } = pkg;   
const JWT_SECRET = process.env.JWT_SECRET || "token.010101010101";

const generateToken = (id:string) => {
    const jwt = sign({id}, JWT_SECRET, {expiresIn: '20s'});
    return jwt;
};

const verifyToken = (jwt: string) => {
    const isOk = verify(jwt, JWT_SECRET);
    return isOk;

};

const generateTokens = (id: string) => {
    const accessToken = sign({ id, additionalData: "exampleData" }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = sign({ id }, JWT_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

export { generateToken, verifyToken, generateTokens };