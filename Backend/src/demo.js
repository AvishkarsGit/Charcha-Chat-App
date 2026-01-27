async function getUser(id) {
  if (!id) return null;
  return { id, role: "admin" };
}
async function getPermissions(role) {
  if (!role) throw new Error("Invalid role");
  return ["WRITE", "READ"];
}

async function handler(req) {
  try {
    const user = await getUser(req.userId);
    const permissions = getPermissions(user?.role);
    return permissions;
  } catch (error) {
    return "ERROR";
  }
}

handler({ userId: "8387373838" })
  .then((res) => console.log(res))
  // .catch((err) => console.log(err));
