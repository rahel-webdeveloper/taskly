export function saveLocalStorage(data, dataName) {
  localStorage.setItem(dataName, JSON.stringify(data));
}

export function loadLocalStorage(dataName) {
  return JSON.parse(localStorage.getItem(dataName));
}
