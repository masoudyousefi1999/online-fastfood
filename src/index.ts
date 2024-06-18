import Server from "./server";

const server = new Server().app;
const port: number = Number(process.env.PORT) || 5000;

server.listen(
  port,
  "192.168.10.25",
  () => {
    console.log("server runing on port 5000")
  }
);
