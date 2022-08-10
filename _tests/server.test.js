'use strict';

const { server, start } = require('../src/server');
const { db } = require('../src/Models/db');
const supertest = require('supertest');
const request = supertest(server);
const logger = require('../src/middleware/logger');

beforeEach(async () => {
  await db.sync();
});
afterEach(async () => {
  await db.drop();
});

describe('server', () => {
  it('throws on bad starts', () => {
    expect(() => {
      start();
    }).toThrow();
  });

  describe('middleware', () => {
    describe('auth', () => {
      const arthur = {
        username: 'Arthur',
        password: 'TerriblePassword',
      };
      it('can sign up a user', async () => {
        const response = await request.post('/signup').send(arthur);
        expect(response.body.username).toBe('Arthur');
        expect(response.body.token).toBeDefined();
      });
      it('can sign in a user', async () => {
        await request.post('/signup').send(arthur);
        const response = await request.post('/signin').send(arthur);
        expect(response.body.user).toBe('Arthur');
        expect(response.body.token).toBeDefined();
      });
      it('can validate a token', async () => {
        const arthurAcc = await request.post('/signup').send(arthur);
        const token = arthurAcc.body.token;
        const response = await request
          .get('/user')
          .set('Authorization', 'Bearer ' + token);
        expect(response.status).toBe(200);
      });
    });
    describe('logger', () => {
      it('can log', async () => {
        const spy = jest.spyOn(console, 'log').mockImplementation();
        await request.get('/');
        expect(spy).toHaveBeenCalled();
      });
      it('calls next', () => {
        const next = jest.fn();
        logger({}, {}, next);
        expect(next).toHaveBeenCalled();
      });
    });
    describe('role checking', () => {
      it('rejects lack of access', async () => {
        const response = await request.get('/user');
        expect(response.status).toBe(403);
        expect(response.text).toBe('missing required roles for this action');
      });
    });
  });
  describe('routes', () => {
    let bearerToken;
    beforeEach(async () => {
      //auth is tested in middleware, so let's just assume we have an admin account for authing these tests
      const phoebe = {
        username: 'Phoebe',
        password: 'UseAPassManager',
      };
      const response = await request.post('/signup').send(phoebe);
      bearerToken = 'Bearer ' + response.body.token;
    });
    it('can create successfully', async () => {
      const exercise = {
        name: 'jumping jacks',
        cardioTime: 5,
        stretchTime: 10,
      };
      const response = await request
        .post('/exercise')
        .set('Authorization', bearerToken)
        .send(exercise);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('jumping jacks');
    });
    it('can fail to create correctly', async () => {
      const badExercise = {
        name: null,
      };
      const response = await request
        .post('/exercise')
        .set('Authorization', bearerToken)
        .send(badExercise);
      expect(response.status).toBe(500);
      expect(response.text).toBe(
        'notNull Violation: Exercise.name cannot be null'
      );
    });

    it('can read many', async () => {
      const response = await request
        .get('/user')
        .set('Authorization', bearerToken);
      expect(response.status).toBe(200);
      expect(response.body[0].username).toBe('Phoebe');
    });
    it('can read one', async () => {
      const response = await request
        .get('/user/1')
        .set('Authorization', bearerToken);
      expect(response.status).toBe(200);
      expect(response.body.username).toBe('Phoebe');
    });

    it('can update successfully', async () => {
      const original = {
        name: 'jumping jacks',
        cardioTime: 5,
        stretchTime: 10,
      };
      const update = {
        name: 'bench press',
      };
      await request
        .post('/exercise')
        .set('Authorization', bearerToken)
        .send(original);
      const response = await request
        .put('/exercise/1')
        .set('Authorization', bearerToken)
        .send(update);
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('bench press');
    });
    it('can fail to update correctly', async () => {
      const original = {
        name: 'jumping jacks',
        cardioTime: 5,
        stretchTime: 10,
      };
      const badUpdate = {
        name: null,
      };
      await request
        .post('/exercise')
        .set('Authorization', bearerToken)
        .send(original);
      const badUpdateResponse = await request
        .put('/exercise/1')
        .set('Authorization', bearerToken)
        .send(badUpdate);
      expect(badUpdateResponse.status).toBe(500);
      expect(badUpdateResponse.text).toBe(
        'notNull Violation: Exercise.name cannot be null'
      );
    });
    it('can delete successfully', async () => {
      const original = {
        name: 'jumping jacks',
        cardioTime: 5,
        stretchTime: 10,
      };
      await request
        .post('/exercise')
        .set('Authorization', bearerToken)
        .send(original);
      const response = await request
        .delete('/exercise/1')
        .set('Authorization', bearerToken);
      expect(response.status).toBe(200);
      expect(response.text).toBe('deleted id 1');
      const stillThere = await request
        .get('/exercise')
        .set('Authorization', bearerToken);
      expect(stillThere.body).toStrictEqual([]);
    });
    it('can fail to delete correctly', async () => {
      const response = await request
        .delete('/exercise/1')
        .set('Authorization', bearerToken);
      expect(response.status).toBe(404);
      expect(response.text).toBe('could not find id 1');
    });
  });
});
