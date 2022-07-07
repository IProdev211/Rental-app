import { NextFunction, Request, Response, Router } from 'express';
import BikeController from '../controllers/bikeController';
import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

class BikeRouter {
  private _router = Router();
  private _controller = BikeController;

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
      '/getAll',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getBikes(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.get(
      '/filter',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getFilteredBikes(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.post(
      '/add',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.addBike(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.put(
      '/edit',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.editBike(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.delete(
      '/delete',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.deleteBike(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new BikeRouter().router;
