## mixbook-http-client

HTTP client for a browser and NodeJS apps.

### Usage

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
const session = client.get("https://www.example.com/coupon/FOOBAR");
```

All the call methods (`get`, `post`, `send`, etc) immediately return `IHttpClientSession`. It has
`.promise` getter, which will be resolved to `IResponse`, and also a way to `.abort()` the request and
track the upload/download progress via `onUploadProgress`/`onDownloadProgress`.

### Testing

There is `MockHttpClient` which also implements `IHttpClient` and its call methods return
`IHttpClientSession`. You can use it to mock the requests:

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

It only matches mocked requests by URL. It doesn't currently take request headers/body into account.

### Retryable client

You can also make your client "retryable" by wrapping it into `RetryableHttpClient`. It also implements
`IHttpClient` and its call methods return `IHttpClientSession`. It will retry the request if the retry
condition is true (by default it is - 3 additional attempts for GET requests which are failed or with >=500
status code), after some delay. It's a proxy class, so you use it by wrapping another http client:

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
