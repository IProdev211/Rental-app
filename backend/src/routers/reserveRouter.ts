import { NextFunction, Request, Response, Router } from 'express';
import reserveController from '../controllers/reserveController';
import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

class ReserveRouter {
  private _router = Router();
  private _controller = reserveController;

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
      '/',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.addReserve(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.get(
      '/',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getMyReserves(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.get(
      '/mine',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getMyReserves(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.delete(
      '/',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.cancelReserve(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new ReserveRouter().router;
