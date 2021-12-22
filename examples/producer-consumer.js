const fastify = require('fastify');
const fastifyAmqpAsync = require('fastify-amqp-async');
const crypto = require('crypto');

const app = fastify();

app.register(fastifyAmqpAsync, {});

app.get('/produce', async function (req, res) {
    const channel = app.amqp.confirmChannel;

    await channel.assertQueue('test', { durable: true });
    const randomString = crypto.randomBytes(4).toString('hex');
    await channel.sendToQueue('test', Buffer.from(randomString));

    console.log(`Sent message: ${randomString}`);

    res.send(randomString);
});

app.get('/consume', async function (req, res) {
    const channel = app.amqp.confirmChannel;

    // noAck is sent to true - don't use that in production
    // if at-least-once delivery semantics are required
    const message = await channel.get('test', { noAck: true });

    if (message === false) {
        res.send('Queue is empty');
    } else {
        console.log(`Retrieved message: ${message.content.toString()}`);
        res.send(message.content.toString());
    }
});

app.listen(3000, (err) => {
    if (err) throw err;
});
