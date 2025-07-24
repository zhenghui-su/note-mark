declare global {
  interface Window {
    context: {
      locale: string
      timeZone: string
    }
  }
}
