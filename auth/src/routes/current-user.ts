import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@olegs777tickets/common';
// import { requireAuth } from '../middlewares/require-auth';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // if (!req.session||!req.session.jwt) {

  res.send({ user: req.user || null });
});

export { router as currentUserRouter };
