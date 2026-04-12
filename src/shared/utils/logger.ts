const isDev = import.meta.env.DEV;

// eslint-disable-next-line no-console
const error = (...args: unknown[]) => isDev && console.error(...args);
// eslint-disable-next-line no-console
const warn = (...args: unknown[]) => isDev && console.warn(...args);
// eslint-disable-next-line no-console
const info = (...args: unknown[]) => isDev && console.info(...args);

const logger = { error, warn, info };

export { logger };
