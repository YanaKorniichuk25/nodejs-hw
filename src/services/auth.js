const { v4: uuidv4 } = require('uuid');
const Session = require('../models/session');
const { FIFTEEN_MINUTES, ONE_DAY } = require('../constants/time');

function generateToken() {
  return uuidv4();
}

async function createSession(userId) {
  const accessToken = generateToken();
  const refreshToken = generateToken();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });

  return session;
}

function setSessionCookies(res, session) {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id.toString(), {
    ...cookieOptions,
    maxAge: ONE_DAY,
  });
}

module.exports = {
  createSession,
  setSessionCookies,
};
