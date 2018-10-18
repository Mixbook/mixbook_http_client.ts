import {expect} from "chai";
import {Url} from "../src/url";

describe("Url", () => {
  describe(".fromString()", () => {
    const builder = (base: string): string => {
      return Url.fromString(base)
        .appendPath("/foo")
        .toString();
    };

    it("normalizes path by adding a leading slash", () => {
      expect(Url.fromString("https://example.com").path).to.eq("/");
      expect(Url.fromString("https://example.com/").path).to.eq("/");
      expect(Url.fromString("https://example.com/foo").path).to.eq("/foo");
      expect(Url.fromString("https://example.com/foo/bar").path).to.eq("/foo/bar");
      expect(Url.fromString("/foo/bar").path).to.eq("/foo/bar");
      expect(Url.fromString("").path).to.eq("/");
    });

    it("parses with path only", () => {
      expect(builder("/bar")).to.eq("/bar/foo");
    });

    it("parses with path and params", () => {
      expect(builder("/bar?a=b")).to.eq("/bar/foo?a=b");
    });

    it("parses without specific schema", () => {
      expect(builder("//example.com")).to.eq("//example.com/foo");
    });

    it("parses without host", () => {
      expect(builder(":3000/bar")).to.eq(":3000/bar/foo");
    });

    it("parses with http schema", () => {
      expect(builder("http://example.com")).to.eq("http://example.com/foo");
    });

    it("parses with existing path and trailing slash", () => {
      expect(builder("http://example.com/bar/")).to.eq("http://example.com/bar/foo");
    });

    it("parses with existing path", () => {
      expect(builder("http://example.com/bar")).to.eq("http://example.com/bar/foo");
    });

    it("parses with port", () => {
      expect(builder("http://example.com:2000/bar")).to.eq("http://example.com:2000/bar/foo");
    });

    it("parses with port and without a path", () => {
      expect(builder("http://example.com:2000")).to.eq("http://example.com:2000/foo");
    });

    it("parses without port, host and path", () => {
      expect(builder("example.com")).to.eq("//example.com/foo");
    });

    it("parses with params", () => {
      expect(builder("example.com?foo=bar")).to.eq("//example.com/foo?foo=bar");
    });

    it("parses with array params", () => {
      expect(builder("example.com/?foo[]=bar&foo[]=bar2")).to.eq("//example.com/foo?foo%5B%5D=bar&foo%5B%5D=bar2");
    });

    it("parses with params and trailing slash", () => {
      expect(builder("example.com/?foo=bar")).to.eq("//example.com/foo?foo=bar");
    });

    it("parses with params and port", () => {
      expect(builder("example.com:3000?foo=bar")).to.eq("//example.com:3000/foo?foo=bar");
    });

    it("parses with wrong format - & instead of ?", () => {
      expect(builder("example.com:3000/blah&foo=bar&a=b")).to.eq("//example.com:3000/blah/foo?a=b&foo=bar");
    });

    it("parses with params and port and trailing slash", () => {
      expect(builder("example.com:3000/?foo=bar")).to.eq("//example.com:3000/foo?foo=bar");
    });

    it("doesn't add hash to the path", () => {
      const url = Url.fromString("http://example.com/foo/bar#");
      expect(url.path).to.eq("/foo/bar");
      expect(url.hash).to.eq("");
    });

    it("extracts hash correctly without params", () => {
      const url = Url.fromString("http://example.com/foo/bar#foo");
      expect(url.path).to.eq("/foo/bar");
      expect(url.hash).to.eq("foo");
    });

    it("extracts hash correctly with params", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=b#foo");
      expect(url.path).to.eq("/foo/bar");
      expect(url.params).to.eql({a: ["b"]});
      expect(url.hash).to.eq("foo");
    });

    it("extracts array params using param=1,2,3 format", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=a,b");
      expect(url.path).to.eq("/foo/bar");
      expect(url.params).to.eql({a: ["a,b"]});
    });

    it("extracts array params using param=1&param=2 format", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=a&a=b");
      expect(url.path).to.eq("/foo/bar");
      expect(url.params).to.eql({a: ["a", "b"]});
    });

    it("decodes params", () => {
      const url = Url.fromString("http://example.com/foo/bar?foo%5B%5D=bar&foo%5B%5D=bar2");

      expect(url.path).to.eq("/foo/bar");
      expect(url.params).to.eql({"foo[]": ["bar", "bar2"]});
    });
  });

  describe("#appendPath()", () => {
    it("adds a path to already existing one ", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=b");
      expect(url.appendPath("blah/woo").toString()).to.eq("http://example.com/foo/bar/blah/woo?a=b");
    });
  });

  describe("#appendParams()", () => {
    it("adds new params to already existing ones", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=b");
      expect(url.appendParams({c: ["d"]}).toString()).to.eq("http://example.com/foo/bar?a=b&c=d");
    });

    it("adds param with same name as existing one", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=b");
      expect(url.appendParams({a: ["c"]}).toString()).to.eq("http://example.com/foo/bar?a=b&a=c");
    });
  });

  describe("#replacePath()", () => {
    it("replace a path with the new one", () => {
      const url = Url.fromString("http://example.com/foo/bar?a=b");
      expect(url.replacePath("blah/woo").toString()).to.eq("http://example.com/blah/woo?a=b");
    });
  });

  describe("#toString()", () => {
    it("encodes the params", () => {
      const url = Url.fromString("http://example.com/foo/bar");
      expect(url.appendParams({foo: ["<?/>&"]}).toString()).to.contain("foo=%3C%3F%2F%3E%26");
    });
  });
});
