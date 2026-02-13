export const generateRoomId = (length = 8) => {
  let roomId = "";
  for (let i = 0; i < length; i++) {
    roomId += Math.floor(Math.random() * 10) + 1;
  }
  return roomId;
};
