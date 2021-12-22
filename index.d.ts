import { Channel, ConfirmChannel, Connection } from 'amqplib-as-promised/lib';
import { FastifyPluginAsync } from 'fastify';

declare namespace fastifyAmqpAsync {
    type FastifyAmqpAsyncConnection = Connection;
    type FastifyAmqpAsyncChannel = Channel;
    type FastifyAmqpAsyncConfirmChannel = ConfirmChannel;

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
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        amqp: {
            connection: fastifyAmqpAsync.FastifyAmqpAsyncConnection;
            channel: fastifyAmqpAsync.FastifyAmqpAsyncChannel;
            confirmChannel: fastifyAmqpAsync.FastifyAmqpAsyncConfirmChannel;
        };
    }
}

declare const fastifyAmqpAsync: FastifyPluginAsync<fastifyAmqpAsync.FastifyAmqpAsyncOptions>;

export default fastifyAmqpAsync;
