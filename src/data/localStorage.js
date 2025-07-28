export function saveLocalStorage(value, key) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function removeLocalStorage(key) {
  localStorage.removeItem(key);
}
