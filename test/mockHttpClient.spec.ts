import {expect} from "chai";
import {MockHttpClient} from "../src/mock/mockHttpClient";
import {MockResponse} from "../src/mock/mockResponse";

describe("MockHttpClient", () => {
  describe("#get", () => {
    context("when returning a string", () => {
      it("makes a GET call", async () => {
        const client = new MockHttpClient();
        const resultJson = {foo: "bar"};
        const result = JSON.stringify(resultJson);
        client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, result, {"content-type": "foo"}));
        const response = await client.get("/foo");
        expect(response.status).to.eq(200);
        expect(response.text).to.eq(result);
        expect(response.json.foo).to.eq("bar");
        expect((await response.arrayBuffer).byteLength).to.eq(Buffer.from(result, "utf8").byteLength);
        expect(response.headers["content-type"]).to.eq("foo");
      });
    });

    context("when returning a Buffer", () => {
      it("makes a GET call", async () => {
        const client = new MockHttpClient();
        const result = Buffer.from("foo", "utf8");
        client.mockRequest(
          {url: "/foo", method: "GET", headers: {accept: "application/msgpack"}},
          new MockResponse(200, result, {"content-type": "foo"})
        );
        const response = await client.get("/foo");
        expect(response.text).to.eq("foo");
        expect((await response.arrayBuffer).byteLength).to.eq(result.byteLength);
        expect(response.headers["content-type"]).to.eq("foo");
      });
    });
  });

  describe("#post", () => {
    it("makes a POST call", async () => {
      const client = new MockHttpClient();
      client.mockRequest(
        {url: "/foo", method: "POST", body: "bar"},
        new MockResponse(200, "foo", {"content-type": "foo"})
      );
      const response = await client.post("/foo", "bar");
      expect(response.status).to.eq(200);
      expect(response.text).to.eq("foo");
      expect(response.headers["content-type"]).to.eq("foo");
    });
  });

  describe("#reset", () => {
    it("erases all mocked requests", () => {
      const client = new MockHttpClient();
      client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, "123"));
      client.reset();
      expect(() => client.get("/foo")).to.throw();
    });
  });
});
