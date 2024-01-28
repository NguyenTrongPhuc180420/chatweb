let listUser = [
  { id: 1, username: "Minh Nguyen", room: "12" },
  { id: 2, username: "TRung Tran", room: "15" },
];
const addUser = (newUser) => {
  listUser = [...listUser, newUser];
};
const removeUser = (id) => {
  listUser = listUser.filter((item) => item.id != id);
  console.log(listUser);
};
const getUser = (room) => listUser.filter((item) => item.room == room);
module.exports = {
  getUser,
  addUser,
  removeUser,
};
