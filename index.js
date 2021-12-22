const fastifyPlugin = require('fastify-plugin');
const amqplibAsPromised = require('amqplib-as-promised');

const defaultOptions = {
    connectionString: 'amqp://guest:guest@localhost:5672',
    useConfirmChannel: true,
    useRegularChannel: false
};

async function fastifyAmqpAsync(fastify, options) {
    const actualOptions = Object.assign({}, defaultOptions, options);

    const connection = await amqplibAsPromised.connect(
        actualOptions.connectionString
    );

    fastify.addHook('onClose', async () => {
        await connection.close();
    });

    let channel;

    if (actualOptions.useRegularChannel) {
        channel = await connection.createChannel();
    }

    let confirmChannel;

    if (actualOptions.useConfirmChannel) {
        confirmChannel = await connection.createConfirmChannel();
    }

    fastify.decorate('amqp', {
        connection,
        channel,
        confirmChannel
    });
}

module.exports = fastifyPlugin(fastifyAmqpAsync, {
    fastify: '>=2.0.0',
    name: 'fastify-amqp-async'
});
