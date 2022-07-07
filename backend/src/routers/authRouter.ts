import { NextFunction, Request, Response, Router } from 'express';
import AuthController from '../controllers/authController';

class AuthRouter {
  private _router = Router();
  private _controller = AuthController;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.post(
      '/signup',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.signUp(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.post(
      '/signInWithToken',
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.signInWithToken(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new AuthRouter().router;
