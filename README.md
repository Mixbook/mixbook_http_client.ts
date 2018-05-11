## mixbook-http-client [![Build Status](https://travis-ci.org/Mixbook/mixbook_http_client.ts.svg?branch=master)](https://travis-ci.org/Mixbook/mixbook_http_client.ts) [![npm package](https://img.shields.io/npm/v/mixbook-http-client.svg?style=flat-square)](https://www.npmjs.org/package/mixbook-http-client)

Composable TypeScript HTTP client for browser and NodeJS apps, with built-in mocking and "middlewares" support.

The idea is - you have some base HTTP clients:

* for the browser (`BrowserHttpClient`),
* for the NodeJS apps (`NodeHttpClient`)
* for the tests (`MockHttpClient`)

They implement the same interface, and completely interchangeable. Which makes it very convenient to use them in isomorphic apps, and also convenient to test.

And then there're a bunch of "middleware" clients (similar to middlewares in web apps), which "enhance" those base clients. They usually wrap those base clients, and implement the same interface, so you can also use them interchangeably. We have:

* `RetryableHttpClient` - will retry a request on condition (e.g. if the request is failing) after some delay.
* `LoggableHttpClient` - will log the info about the requests using the provided logger.
* `MsgPackHttpClient` - will add methods for making calls to APIs, that respond in msgpack format.

The library is pretty small (~6kb compressed if you use everything except `MsgPackHttpClient`, and ~25kb if you use `MsgPackHttpClient`).
It's also tree-shaking friendly, so if you don't use some of those base or middleware clients, they won't be included into the bundle.

You can build your own "middlewares", they just need to implement the same `IHttpClient` interface, and that's it.

### Usage

So, there're a bunch of various `HttpClient` classes, all of them conform to the same interface. You can build your custom uber http client with the features you need.

You create an instance of `HttpClient`, for a browser:

```ts
import {BrowserHttpClient} from "mixbook-http-client/build/browser";

const client = new BrowserHttpClient();
```

or for a NodeJS app:

```ts
import {NodeHttpClient} from "mixbook-http-client/build/node";

const client = new NodeHttpClient();
```

They all implement the same interface, `IHttpClient`. Then you make a call, like:

```ts
const response = await client.get("https://www.example.com/coupon/FOOBAR");
```

All the call methods (`get`, `post`, `put`, `delete`) return `Promise<IResponse>`. If you need to track the upload/download progress via `onUploadProgress`/`onDownloadProgress`, or be able to abort the request, or set the request timeout, you should use (`send`), it will return `IHttpClientSession`, it has all of that.

You can also set the default headers or the default timeout via the constructor arguments of browser or NodeJS clients. They always gonna be used with all the requests made via those clients. Like:

```ts
import {NodeHttpClient} from "mixbook-http-client/build/node";

const client = new NodeHttpClient({timeout: 1000, headers: {"content-type": "application/json"}});
```

[Try it out!](https://runkit.com/embed/h8bg6t9rrbdn)

### Testing

There is `MockHttpClient` which also implements `IHttpClient`.

```ts
import {MockHttpClient, MockResponse} from "mixbook-http-client/build/mock";

const client = new MockHttpClient();
client.mockRequest(
  {method: "GET", url: "https://example.com/coupon/FOOBAR"},
  new MockResponse(200, JSON.stringify({data: "ok"}))
);
const json = (await client.get("https://example.com/coupon/FOOBAR").promise).json;
expect(json.data).to.eq("ok");
expect(client.executedRequests.filter(r => r.request.url === "https://example.com/coupon/FOOBAR").length).to.eq(1);
```

By default, it only matches mocked requests by URL. If you want it to take request headers/body into account, you can use constructor arguments `shouldUseBody` and `shouldUseHeaders`.

By default, if you make several requests that match the same URL (and optionally headers/body), it will return the same mocked response. If you want to test a sequence of requests (like first `/foo` returns `{data: "foo"}`, second `/foo` returns `{data: "bar"}`, you can use `isRepeating: false` constructor argument.

### Retryable client

You can also make your client "retryable" by wrapping it into `RetryableHttpClient`. It also implements `IHttpClient`. It will retry the request if the retry condition is true (by default it's - 3 additional attempts for GET requests which are failed or with >=500 status code), after some delay. It's a proxy class, so you use it by wrapping another http client:

```ts
import {BrowserHttpClient} from "mixbook-http-client/build/browser";
import {RetryableHttpClient} from "mixbook-http-client/build/retryable";

const retryableClient1 = new RetryableHttpClient(new BrowserHttpClient());
/// or
const retryableClient2 = new RetryableHttpClient(new BrowserHttpClient(), {
  retryCondition: (request, response, error, retryCount) =>
    retryCount < 10 && (response == null || response.status >= 400),
  delaysInMilliseconds: [500, 1000, 1500],
});
```

### Loggable client

You can make your client "loggable" by wrapping it into `LoggableHttpClient`. It also implements `IHttpClient`. It accepts an object, that conforms to `ILoggable` interface (e.g., just a regular `console`), and gonna use that object to log information about requests and responses.

```ts
import {BrowserHttpClient} from "mixbook-http-client/build/browser";
import {LoggableHttpClient} from "mixbook-http-client/build/loggable";

const loggableClient = new LoggableHttpClient(new BrowserHttpClient(), console);
```

### MsgPack client

You can use `MsgPackHttpClient` to talk to APIs, that send MsgPack responses. It also implements `IHttpClient`, but in addition it adds some other methods, like `getMsgPack`, `postMsgPack`, `sendMsgPack`.  Same as `RetryableHttpClient` - it's a proxy, you initialize it by passing another `IHttpClient` as an
argument.

The reason why it's not part of `HttpClient` base class (which would make some sense) - it depends on `msgpack-lite`, which is quite heavy. So, if you don't use `MsgPackHttpClient`, the compressed/gzipped size of `mixbook-http-client` will be around 7kb, but if you do use it - around 25kb.

### Building an UBER client

So, as an example, you build a client, which has all of those features, like this:

```ts
import {NodeHttpClient} from "mixbook-http-client/build/node";
import {MsgPackHttpClient} from "mixbook-http-client/build/msgPackClient";
import {LoggableHttpClient} from "mixbook-http-client/build/loggable";
import {RetryableHttpClient} from "mixbook-http-client/build/retryable";

const client = new LoggableHttpClient(
  new RetryableHttpClient(new MsgPackHttpClient(new NodeHttpClient()), {
    retryCondition: (request, response, error, retryCount) =>
      retryCount < 10 && (response == null || response.status >= 400),
    delaysInMilliseconds: [500, 1000, 1500],
  }),
  console
);
```
