import { httpRouter } from "convex/server";
import { postUpload } from "./uploads/httpActions";

const http = httpRouter();

http.route({
  path: "/sections/parse-pdf",
  method: "POST",
  handler: postUpload,
});

export default http;
