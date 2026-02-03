class Storage {
  setItem(value) {
    localStorage.setItem("selectedUser", JSON.stringify(value));
  }
  getItem() {
    return JSON.parse(localStorage.getItem("selectedUser"));
  }
}
export const storage = new Storage();
