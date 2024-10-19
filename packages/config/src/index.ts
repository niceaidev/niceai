export function loadConfig() {
  return {
    PORT: Number(process.env.PORT || 3000),
  }
}

export default loadConfig;
