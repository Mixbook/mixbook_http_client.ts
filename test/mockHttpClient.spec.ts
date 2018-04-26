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

      it("makes a GET call twice and gets the same response", async () => {
        const client = new MockHttpClient();
        const resultJson = {foo: "bar"};
        const result = JSON.stringify(resultJson);
        client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, result, {"content-type": "foo"}));
        const response1 = await client.get("/foo");
        const response2 = await client.get("/foo");
        expect(response1.text).to.eq(result);
        expect(response2.text).to.eq(result);
      });

      it("records executed calls", async () => {
        const client = new MockHttpClient();
        const resultJson = {foo: "bar"};
        const result = JSON.stringify(resultJson);
        client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, result, {"content-type": "foo"}));
        const response1 = await client.get("/foo");
        const response2 = await client.get("/foo");
        expect(client.executedRequests.map(r => [r.request.url, r.response.text])).to.eql([
          ["/foo", result],
          ["/foo", result],
        ]);
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

  context("when isRepeating is false", () => {
    it("makes a GET call several times and gets different responses", async () => {
      const client = new MockHttpClient({isRepeating: false});
      const result1 = JSON.stringify({foo: "bar"});
      const result2 = JSON.stringify({foo: "blah"});
      client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, result1, {"content-type": "foo"}));
      client.mockRequest({url: "/foo", method: "GET"}, new MockResponse(200, result2, {"content-type": "foo"}));
      const response1 = await client.get("/foo");
      const response2 = await client.get("/foo");
      expect(async () => await client.get("/foo")).to.throw;
      expect(response1.text).to.eq(result1);
      expect(response2.text).to.eq(result2);
    });
  });

  context("when shouldUseHeaders is true", () => {
    it("distinguishes calls with different headers", async () => {
      const client = new MockHttpClient({shouldUseHeaders: true});
      const result1 = JSON.stringify({foo: "bar"});
      const result2 = "blah";
      client.mockRequest(
        {url: "/foo", method: "GET", headers: {accept: "application/json"}},
        new MockResponse(200, result1, {"content-type": "application/json"})
      );
      client.mockRequest(
        {url: "/foo", method: "GET", headers: {accept: "text/html"}},
        new MockResponse(200, result2, {"content-type": "text/html"})
      );
      const response1 = await client.get("/foo", {accept: "application/json"});
      const response2 = await client.get("/foo", {accept: "text/html"});
      expect(response1.text).to.eq(result1);
      expect(response2.text).to.eq(result2);
    });
  });

  context("when shouldUseBody is true", () => {
    it("distinguishes calls with different bodies", async () => {
      const client = new MockHttpClient({shouldUseBody: true});
      client.mockRequest({url: "/foo", method: "POST", body: "bar"}, new MockResponse(200, "bar"));
      client.mockRequest({url: "/foo", method: "POST", body: "blah"}, new MockResponse(200, "blah"));
      const response1 = await client.post("/foo", "bar");
      const response2 = await client.post("/foo", "blah");
      expect(response1.text).to.eq("bar");
      expect(response2.text).to.eq("blah");
    });
  });
});
