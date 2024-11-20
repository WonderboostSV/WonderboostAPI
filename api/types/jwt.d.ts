// types/jwt.d.ts
declare namespace Express {
    interface Request {
      user?: { idAdministrador: string }; // Aquí defines el tipo para el JWT decodificado
    }
  }
  