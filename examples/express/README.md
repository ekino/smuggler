# express

This example provides a simple [express](https://github.com/expressjs/express) application that listen on port **3000**.

All this example try to request the `http://foo.bar/say-hello` endpoint which does not exist.

Without mock, the request will fail at DNS resolution (i.e. `-3008 ENOTFOUND getaddrinfo`).

With a mock, you should get either a 200 answer with `Hello World!` as a body or a 404 with `I don't know you!` as a body.

You can launch the application this way:
```shell
$ node index.js
Listening on port 3000.
1 mock(s) loaded.
```

You can now `curl` the API:
```shell
$ curl -X GET http://localhost:3000
{"errno":-3008,"code":"ENOTFOUND","syscall":"getaddrinfo","hostname":"foo.bar"}
```

Let's try again with a mock this time:
```shell
$ curl -X GET -H 'x-mock-id: hello-world' http://localhost:3000
{"status":200,"body":"Hello World!"}

$ curl -X GET -H 'x-mock-id: hello-world' 'http://localhost:3000?to=you'
{"status":404,"body":"I don't know you!"}
```
