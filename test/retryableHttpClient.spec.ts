import {expect} from "chai";
import {MockHttpClient} from "../src/mock/mockHttpClient";
import {RetryableHttpClient} from "../src/retryable/retryableHttpClient";
import {MockResponse} from "../src/mock/mockResponse";

describe("RetryableHttpClient", () => {
  it("makes a call with custom retry condition and delaysInMilliseconds", async () => {
    const client = new MockHttpClient();
    client.mockRequest(
      {url: "/foo", method: "GET"},
      new MockResponse(200, JSON.stringify({foo: "bar"}), {"content-type": "foo"})
    );

    const retryableClient = new RetryableHttpClient(client, {
      retryCondition: (request, response, error, retryCount) =>
        retryCount < 3 && (response == null || response.status === 200),
      delaysInMilliseconds: [5, 10, 15],
    });

    const result = await retryableClient.get("/foo");
    expect(result.json.foo).to.eq("bar");
  });

  it("makes a call with default retry condition", async () => {
    const client = new MockHttpClient();
    client.mockRequest(
      {url: "/foo", method: "GET"},
      new MockResponse(500, JSON.stringify({foo: "bar"}), {"content-type": "foo"})
    );

    const retryableClient = new RetryableHttpClient(client, {
      delaysInMilliseconds: [5, 10, 15],
    });

    const result = await retryableClient.get("/foo");
    expect(result.json.foo).to.eq("bar");
  });
});
