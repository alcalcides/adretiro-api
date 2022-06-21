export function isAValidOrigin(origin) {
  switch (origin) {
    case "https://localhost:3000":
    case "https://adretiro-dev.herokuapp.com":
    case "https://adretiro.com.br":
      return true;
    default:
      return false;
  }
}
