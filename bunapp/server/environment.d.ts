declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_SECRET: string
      CLIENT_ID: string
      FRONTEND_URI: string
      REDIRECT_URI: string
      PORT?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export { }