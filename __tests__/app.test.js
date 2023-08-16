const app = require("../app");
const request = require("supertest");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
    return connection.end();
});

beforeEach(() => {
    return seed(data);
});

describe('app', () => {
    describe('/api/healthcheck', () => {
        test('200 : responds with a status of 200', () => {
            return request(app)
            .get('/api/healthcheck')
            .expect(200)
            .then((response) => {
                const { msg } = response.body;
                expect(msg).toBe('Server is running')
            });
        });
    });
    describe('/api/topics', () => {
        test('200 : responds with an array of topic objects', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const { topics } = response.body;
                expect(topics).toBeInstanceOf(Array);
                expect(topics).toHaveLength(3);
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug', expect.any(String));
                    expect(topic).toHaveProperty('description', expect.any(String));
                });
            });
        });
        test('404 : returns an error message if path is incorrect', () => {
            return request(app)
            .get('/api/topics123')
            .expect(404)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Bad Request');
            });
        });
    });

    
    describe('/api/articles/:article_id', () => {
        test('200 : responds with an article object with all the given properties', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const properties = ['article_id', 'title', 'topic', 'author', 'body', 'created_at', 'votes', 'article_img_url']
                properties.forEach((property) => {
                    expect(response.body).toHaveProperty(property);
                });
                
            });
        });
        test('200 : responds with the correct article object', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                expect(response.body.title).toEqual('Living in the shadow of a great man');
                expect(response.body.article_id).toEqual(1);
                expect(response.body.topic).toEqual('mitch');
                expect(response.body.author).toEqual('butter_bridge');
                expect(response.body.body).toEqual('I find this existence challenging');
                expect(response.body.created_at).toEqual('2020-07-09T20:11:00.000Z');
                expect(response.body.votes).toEqual(100);
                expect(response.body.article_img_url).toEqual('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700');
            });
        });
        test('400 : returns an error message if id is invalid', () => {
            return request(app)
            .get('/api/articles/banana')
            .expect(400)
            .then(({body}) => {
                const  {msg} = body;
                expect(msg).toBe('Invalid id');
            });
        });

    });

});
