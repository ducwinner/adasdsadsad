export function setStoreage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

export function getStoreage(name) {
  return JSON.parse(localStorage.getItem(name));
}
