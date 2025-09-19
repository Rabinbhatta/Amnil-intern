import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My API",
    description: "API documentation",
    version: "1.0.0",
  },
  host: "localhost:8000", // update if deploying
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["../index.js"]; // entry file where your routes are defined

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);