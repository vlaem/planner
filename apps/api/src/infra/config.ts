export const Config = {
  get appEnv() {
    return process.env.APP_ENV ?? "localhost";
  },

  JWT: {
    get secret() {
      return process.env.JWT_ISSUER_SECRET ?? "secret";
    },
    get duration() {
      let minutes = Number.parseInt(process.env.JWT_DURATION_MINUTES ?? "15", 10);
      if (Number.isNaN(minutes) || minutes <= 0) {
        minutes = 15;
      }
      return Temporal.Duration.from({ minutes });
    },
  },
};
