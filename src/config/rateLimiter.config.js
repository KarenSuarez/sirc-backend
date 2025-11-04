import rateLimit from 'express-rate-limit';

// Rate limiter para login - más restrictivo
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por ventana
  message: {
    message: 'Demasiados intentos de login. Por favor intente nuevamente en 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usar IP como identificador
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Rate limiter para registro - moderado
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros por hora por IP
  message: {
    message: 'Demasiados intentos de registro. Por favor intente nuevamente más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Rate limiter para logout - menos restrictivo
export const logoutLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 10, // 10 intentos
  message: {
    message: 'Demasiadas solicitudes de logout. Por favor espere un momento.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter general para rutas autenticadas
export const authRoutesByconsultLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30, // 30 solicitudes por minuto
  message: {
    message: 'Demasiadas solicitudes. Por favor disminuya la frecuencia de sus peticiones.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
