# Fastify AMQP plugin based on amqplib-as-promised

**fastify-amqp-async** is a Fastify plugin allowing for interacting with RabbitMQ using a more modern, Promise-based API provided by [amqplib-as-promised](https://github.com/twawszczak/amqplib-as-promised), so that writing publishers/consumers doesn't feel like 2013.

## Features

- Supports both channels with publisher confirms and regular channels
- Decorates the Fastify Instance with RabbitMQ `connection`, `channel` and `confirmChannel` exposing [amqplib-as-promised API](https://github.com/twawszczak/amqplib-as-promised#api)
- Has 100% test coverage 

## Installation

```
npm install fastify-amqp-async
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