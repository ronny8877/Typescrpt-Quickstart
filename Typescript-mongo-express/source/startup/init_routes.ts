const sample = require("../routes/sample");

export default function (app: any) {
  app.use("/sample", sample);
}
