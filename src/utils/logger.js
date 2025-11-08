const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  dim: "\x1b[2m",
};

const getTimestamp = () => {
  const d = new Date();
  return d.toISOString().replace("T", " ").substring(0, 23);
};

/**
 * Crea una instancia de logger con un contexto específico.
 * @param {string} context - El nombre del módulo/archivo (ej: 'UserService', 'server.js')
 */
const createLogger = (context) => {
  /**
   * Función base para formatear y escribir el log.
   * @param {string} level - Nivel de log (INFO, WARN, ERROR)
   * @param {string} levelColor - Color ANSI para el nivel
   * @param {string} message - El mensaje principal
   * @param {array} args - Argumentos adicionales (ej: objetos, errores)
   */
  const log = (level, levelColor, message, ...args) => {
    const ts = `${colors.dim}${getTimestamp()}${colors.reset}`;
    const lvl = `${levelColor}${level.padEnd(5)}${colors.reset}`;
    const ctx = `${colors.magenta}[${context}]${colors.reset}`;
    const formattedMessage = `${ts} ${lvl} ${ctx} ${message}`;

    if (level === "ERROR") {
      console.error(formattedMessage, ...args);
    } else if (level === "WARN") {
      console.warn(formattedMessage, ...args);
    } else {
      console.log(formattedMessage, ...args);
    }
  };

  return {
    info: (message, ...args) => {
      log("INFO", colors.blue, message, ...args);
    },

    warn: (message, ...args) => {
      log("WARN", colors.yellow, message, ...args);
    },

    error: (message, ...args) => {
      if (message instanceof Error) {
        log(
          "ERROR",
          colors.red,
          message.message,
          `\n${message.stack}`,
          ...args
        );
      } else {
        log("ERROR", colors.red, message, ...args);
      }
    },

    debug: (message, ...args) => {
      if (process.env.NODE_ENV === "development") {
        log("DEBUG", colors.dim, message, ...args);
      }
    },
  };
};

export default createLogger;
