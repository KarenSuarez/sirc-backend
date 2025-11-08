import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: 'Demasiados intentos de login. Por favor intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req)
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 3,
  message: {
    message: 'Demasiados intentos de registro. Por favor intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req)
});

export const logoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: {
    message: 'Demasiadas solicitudes de logout. Por favor espere un momento.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authRoutesByconsultLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  message: {
    message: 'Demasiadas solicitudes. Por favor disminuya la frecuencia de sus peticiones.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
