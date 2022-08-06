"use strict";

const { server } = require("../src/server");
const supertest = require("supertest");
const request = supertest(server);
const logger = require("../src/middleware/logger");

describe("server", () => {
  describe("middleware", () => {
    describe("logger", () => {
      it("can log", async () => {
        const spy = jest.spyOn(console, "log").mockImplementation();
        await request.get("/");
        expect(spy).toHaveBeenCalled();
      });
      it("calls next", () => {
        const next = jest.fn();
        logger({}, {}, next);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
