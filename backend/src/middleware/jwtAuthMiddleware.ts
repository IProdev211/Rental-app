import { Request, Response, NextFunction } from 'express';
import { auth, firestore } from 'firebase-admin';

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const idToken = authHeader.split(' ')[1];
    auth()
      .verifyIdToken(idToken)
      .then(function (decodedToken) {
        firestore().collection('users').doc(decodedToken.uid).get().then((res) => {
          const role = res.data()?.role
          console.log(req.body)
          req.body = { ...req.body, role }
          return next();
        })
      })
      .catch(function (error) {
        return res.sendStatus(403);
      });
  } else {
    res.sendStatus(401);
  }
};
