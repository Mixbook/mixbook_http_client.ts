## mixbook-http-client

Composable TypeScript HTTP client for browser and NodeJS apps.

### Usage

The idea is - this package offers you a bunch of various `HttpClient` classes, all of them conform
to the same interface. So you can build your custom uber http client with the features you need.

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

All the call methods (`get`, `post`, `put`, `delete`) return `Promise<IResponse>`. If you need to
track the upload/download progress via `onUploadProgress`/`onDownloadProgress`, or be able to abort
the request, you should use (`send`), it will return `IHttpClientSession`, it has all of that.

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
```

By default, it only matches mocked requests by URL. If you want it to take request headers/body into account,
you can use constructor arguments `shouldUseBody` and `shouldUseHeaders`.

By default, if you make several requests that match the same URL (and optionally headers/body), it will return
the same mocked response. If you want to test a sequence of requests (like first `/foo` returns `{data: "foo"}`,
second `/foo` returns `{data: "bar"}`, you can use `isRepeating: false` constructor argument.

### Retryable client

You can also make your client "retryable" by wrapping it into `RetryableHttpClient`. It also implements
`IHttpClient`. It will retry the request if the retry condition is true (by default it's - 3 additional
attempts for GET requests which are failed or with >=500 status code), after some delay. It's a proxy
class, so you use it by wrapping another http client:

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

You can make your client "loggable" by wrapping it into `LoggableHttpClient`. It also implements
`IHttpClient`. It accepts an object, that conforms to `ILoggable` interface (e.g., just a regular
`console`), and gonna use that object to log information about requests and responses.

```ts
import {BrowserHttpClient} from "mixbook-http-client/build/browser";
import {LoggableHttpClient} from "mixbook-http-client/build/loggable";

const loggableClient = new LoggableHttpClient(new BrowserHttpClient(), console);
```

### MsgPack client

You can use `MsgPackHttpClient` to talk to APIs, that send MsgPack responses. It also implements
`IHttpClient`, but in addition it adds some other methods, like `getMsgPack`, `postMsgPack`, `sendMsgPack`.
Same as `RetryableHttpClient` - it's a proxy, you initialize it by passing another `IHttpClient` as an
argument.

The reason why it's not part of `HttpClient` base class (which would make some sense) - it depends on `msgpack-lite`,
which is quite heavy. So, if you don't use `MsgPackHttpClient`, the compressed/gzipped size of `mixbook-http-client`
will be around 7kb, but if you do use it - around 25kb.

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
