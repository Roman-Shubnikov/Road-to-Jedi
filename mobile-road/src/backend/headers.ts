export const baseAuth = {
  Authorization: `Bearer ${window.location.search.slice(1)}`,
}
export const jsonAuth = {
  Authorization: `Bearer ${window.location.search.slice(1)}`,
  'Content-Type': 'application/json',
}
export const API_NEW_URL = `${process.env.REACT_APP_API_URL}/api`;



