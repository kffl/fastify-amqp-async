# Fastify AMQP plugin with a modern, promise-based API

[![CI Workflow](https://github.com/kffl/fastify-amqp-async/actions/workflows/ci.yml/badge.svg)](https://github.com/kffl/fastify-amqp-async/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/fastify-amqp-async.svg?style=flat)](https://www.npmjs.com/package/fastify-amqp-async)
[![NPM downloads](https://img.shields.io/npm/dm/fastify-amqp-async.svg?style=flat)](https://www.npmjs.com/package/fastify-amqp-async)
[![Known Vulnerabilities](https://snyk.io/test/github/kffl/fastify-amqp-async/badge.svg)](https://snyk.io/test/github/kffl/fastify-amqp-async)

**fastify-amqp-async** is a Fastify plugin inspired by **fastify-amqp** which allows for interacting with RabbitMQ using a more modern, Promise-based API provided by [amqplib-as-promised](https://github.com/twawszczak/amqplib-as-promised), so that writing publishers doesn't feel like 2013.

## Features

- Supports both channels with publisher confirms and regular channels
- Decorates the Fastify Instance with `amqp` object exposing RabbitMQ `connection`, `channel` and `confirmChannel` following [amqplib-as-promised API](https://github.com/twawszczak/amqplib-as-promised#api)
- Has 100% test coverage 

## Installation

```
npm install fastify-amqp-async
```

The underlying `amqplib-as-promised` library exposes some objects of `amqplib` native types such as `Message`. In order to allow for proper typechecks of such objects, it is recommended to install `@types/amqplib` as a development dependency:

```
npm install --save-dev @types/amqplib
```

## Usage

```javascript
const fastify = require('fastify');
const fastifyAmqpAsync = require('fastify-amqp-async');

const app = fastify();

const options = {
    connectionString: "amqp://user:password@localhost:5672",
    useConfirmChannel: false, // true by default
    useRegularChannel: true, // false by default
}

app.register(fastifyAmqpAsync, options);

app.get('/produce', async function (req, res) {
    const channel = this.amqp.channel;

    await channel.assertQueue('queuename', { durable: true });
    await channel.sendToQueue('queuename', Buffer.from("Sample message"));

    res.send("done");
});
```

You can find additional usage examples in the `examples` folder.

## Reference

The config object passed as a second parameter passed to `register()` is optional (since all 4 of its keys have default values) has the following schema:

```typescript
interface FastifyAmqpAsyncOptions {
    /**
     * AMQP connection string
     * @default 'amqp://guest:guest@localhost:5672'
     */
    connectionString?: string;
    /**
     * Spawn a confirm channel (awaiting publisher confirmations) exposed via FastifyInstance.amqp.confirmChannel
     * @default true
     */
    useConfirmChannel?: boolean;
    /**
     * Spawn a regular channel (fire-and-forget) exposed via FastifyInstance.amqp.channel
     * @default false
     */
    useRegularChannel?: boolean;
    /**
     * Ignore the default onClose handler which closes the connection
     * If set to true, you have to manage closing the connection yourself
     * (i.e. after waiting for all in-flight messages to be delivered)
     * @default false
     */
    ignoreOnClose?: boolean;
}
```

Upon being registered, fastify-amqp-async decorates the FastifyInstance with `amqp` exposing the following keys:

- `connection` - the underlying amqplib-as-promised connection object ([API reference](https://github.com/twawszczak/amqplib-as-promised#connection))
- `channel` - a single amqplib-as-promised fire-and-forget channel object ([API reference](https://github.com/twawszczak/amqplib-as-promised#channel)). Bare in mind that it will be undefined by default unless `useRegularChannel` is set to `true` in the config object.
- `confirmChannel` - a single amqplib-as-promised channel with publisher confirms ([API reference](https://github.com/twawszczak/amqplib-as-promised#confirm-channel)). Will be undefined if `useConfirmChannel` is set to `false` in the config object.