import { Server } from "./server";

const server = new Server().app;
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server listen at port :${port}`);
});


