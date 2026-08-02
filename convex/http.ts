import { httpRouter } from "convex/server";
import { postUpload } from "./uploads/httpActions";
import { httpAction } from "./_generated/server";
import { corsHeaders } from "./cors";

const http = httpRouter();

http.route({
  path: "/sections/parse-pdf",
  method: "POST",
  handler: postUpload,
});
http.route({
  path: "/sections/parse-pdf",
  method: "OPTIONS",
  handler: httpAction(async () =>
    Response.json(null, {
      status: 204,
      headers: corsHeaders,
    }),
  ),
});

export default http;
