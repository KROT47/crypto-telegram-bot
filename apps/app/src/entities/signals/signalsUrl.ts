const { VITE_API_ORIGIN } = import.meta.env;

if (VITE_API_ORIGIN === undefined) {
  throw Error('VITE_API_ORIGIN env var is not defined');
}

export const signalsUrl = new URL(`${VITE_API_ORIGIN}/signals`);
