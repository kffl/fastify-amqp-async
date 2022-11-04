const fastifyPlugin = require('fastify-plugin');
const amqplibAsPromised = require('amqplib-as-promised');

const defaultOptions = {
    connectionString: 'amqp://guest:guest@localhost:5672',
    useConfirmChannel: true,
    useRegularChannel: false,
    ignoreOnClose: false,
    name: 'amqp',
};

async function fastifyAmqpAsync(fastify, options) {
    const actualOptions = Object.assign({}, defaultOptions, options);

    const logger = fastify.log.child({ plugin: 'fastify-amqp-async' });

    logger.info('opening AMQP connection');
    const connection = await amqplibAsPromised.connect(
        actualOptions.connectionString
    );

    fastify.addHook('onClose', async () => {
        if (!actualOptions.ignoreOnClose) {
            logger.info('closing AMQP connection');
            await connection.close();
        }
    });

    let channel;

    if (actualOptions.useRegularChannel) {
        logger.debug('creating AMQP channel without publisher confirms');
        channel = await connection.createChannel();
    }

    let confirmChannel;

    if (actualOptions.useConfirmChannel) {
        logger.debug('creating AMQP channel with publisher confirms');
        confirmChannel = await connection.createConfirmChannel();
    }

    fastify.decorate(actualOptions.name, {
        connection,
        channel,
        confirmChannel
    });
}

module.exports = fastifyPlugin(fastifyAmqpAsync, {
    fastify: '>=2.0.0',
    name: 'fastify-amqp-async'
});
