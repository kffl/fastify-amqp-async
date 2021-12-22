import { Channel, Connection, ConfirmChannel } from 'amqplib-as-promised/lib';
import Fastify, { FastifyInstance } from 'fastify';
import { expectAssignable, expectType } from 'tsd';
import fastifyAmqpAsync from './index';

const app: FastifyInstance = Fastify();

app.register(fastifyAmqpAsync, {
    useConfirmChannel: true,
    useRegularChannel: true
});

app.after(() => {
    expectAssignable<Connection>(app.amqp.connection);
    expectType<fastifyAmqpAsync.FastifyAmqpAsyncConnection>(
        app.amqp.connection
    );

    expectAssignable<Channel>(app.amqp.channel);
    expectType<fastifyAmqpAsync.FastifyAmqpAsyncChannel>(app.amqp.channel);

    expectAssignable<ConfirmChannel>(app.amqp.confirmChannel);
    expectType<fastifyAmqpAsync.FastifyAmqpAsyncConfirmChannel>(
        app.amqp.confirmChannel
    );
});
