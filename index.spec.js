const Fastify = require('fastify');
const fastifyAmqpAsync = require('./index');

let app;

beforeEach(() => {
    app = Fastify();
});

afterEach(() => {
    app.close();
});

test('default values', (done) => {
    app.register(fastifyAmqpAsync).ready((err) => {
        expect(err).toBeUndefined();
        expect(app.amqp).toHaveProperty('connection');
        expect(app.amqp).toHaveProperty('confirmChannel');
        expect(app.amqp).toHaveProperty('channel');
        expect(app.amqp.channel).toBeUndefined();
        expect(app.amqp.confirmChannel).toBeDefined();
        done();
    });
});

test('regular channel without confirmChannel', (done) => {
    app.register(fastifyAmqpAsync, {
        useConfirmChannel: false,
        useRegularChannel: true
    }).ready((err) => {
        expect(err).toBeUndefined();
        expect(app.amqp).toHaveProperty('connection');
        expect(app.amqp).toHaveProperty('confirmChannel');
        expect(app.amqp).toHaveProperty('channel');
        expect(app.amqp.confirmChannel).toBeUndefined();
        expect(app.amqp.channel).toBeDefined();
        done();
    });
});

test('invalid port in connection string', () => {
    expect.assertions(1);
    return expect(
        app
            .register(fastifyAmqpAsync, {
                connectionString: 'amqp://guest:guest@localhost:1234'
            })
            .ready()
    ).rejects.toThrowError();
});

test('unroutable host', () => {
    expect.assertions(1);
    return expect(
        app
            .register(fastifyAmqpAsync, {
                connectionString: 'amqp://guest:guest@nonexistenthost:5672'
            })
            .ready()
    ).rejects.toThrowError();
});

test('invalid protocol', () => {
    expect.assertions(1);
    return expect(
        app
            .register(fastifyAmqpAsync, {
                connectionString: 'xamqp://guest:guest@localhost:5672'
            })
            .ready()
    ).rejects.toThrowError();
});
