import {expect} from "chai";
import {MockHttpClient, MockResponse} from "../src/mock";
import {ILogger, LoggableHttpClient} from "../src/loggable/loggableHttpClient";

class Logger implements ILogger {
  public readonly debugLogs: string[] = [];
  public readonly infoLogs: string[] = [];
  public readonly warnLogs: string[] = [];

  public debug(msg: string): void {
    this.debugLogs.push(msg);
  }

  public info(msg: string): void {
    this.infoLogs.push(msg);
  }

  public warn(msg: string): void {
    this.warnLogs.push(msg);
  }
}

describe("LoggableHttpClient", () => {
  it("logs a GET call", async () => {
    const client = new MockHttpClient();
    client.mockRequest(
      {url: "/foo", method: "GET"},
      new MockResponse(200, JSON.stringify({foo: "bar"}), {"content-type": "foo"})
    );

    const logger = new Logger();
    const loggableClient = new LoggableHttpClient(client, logger);

    const result = await loggableClient.get("/foo");

    expect(result.json.foo).to.eq("bar");
    expect(logger.debugLogs).to.contain('Completed with body: {"foo":"bar"}');
    expect(logger.infoLogs).to.contain("Started GET '/foo'");
  });

  it("logs a POST call", async () => {
    const client = new MockHttpClient();
    client.mockRequest(
      {url: "/foo", method: "POST", body: "FOO", headers: {some: "Stuff"}},
      new MockResponse(400, JSON.stringify({foo: "bar"}), {"content-type": "foo"})
    );

    const logger = new Logger();
    const loggableClient = new LoggableHttpClient(client, logger);

    const result = await loggableClient.post("/foo", "FOO", {some: "Stuff"});

    expect(result.json.foo).to.eq("bar");
    expect(logger.debugLogs).to.contain('Started with body: "FOO"');
    expect(logger.debugLogs).to.contain('Completed with body: {"foo":"bar"}');
    expect(logger.infoLogs).to.contain("Started POST '/foo', headers: '{\"some\":\"Stuff\"}'");
    expect(logger.warnLogs.some(l => /Completed POST/.test(l))).to.be.true;
  });
});
