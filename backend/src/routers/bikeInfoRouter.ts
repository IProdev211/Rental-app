import { NextFunction, Request, Response, Router } from 'express';
import BikeInfoController from '../controllers/bikeInfoController';
import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

class BikeInfoRouter {
  private _router = Router();
  private _controller = BikeInfoController;

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
    this._router.get(
      '/constants',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getConstants(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new BikeInfoRouter().router;
