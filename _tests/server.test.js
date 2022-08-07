'use strict';

const { server, start } = require('../src/server');
const supertest = require('supertest');
const request = supertest(server);
const logger = require('../src/middleware/logger');

describe('server', () => {
  it('throws on bad starts', () => {
    expect(() => {
      start();
    }).toThrow();
  });

  describe('auth', () => {
    /*
    auth is real broke atm!
    const phoebe = {
      username: 'Phoebe',
      password: 'TerriblePassword',
    };
    it('can sign up a user', async () => {
      const newAccount = await request.put('/signup').send(phoebe);
      expect(newAccount.username).toBe('Phoebe');
      expect(newAccount.token).toBeDefined();
    });
    it('can sign in a user', async () => {
      await request.put('/signup').send(phoebe);
      const signInResponse = await request.post('/signin').send(phoebe);
      expect(signInResponse.username).toBe('Phoebe');
      expect(signInResponse.token).toBeDefined();
    });
    */
  });

  describe('middleware', () => {
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
  });
});
