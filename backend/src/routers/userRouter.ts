import { NextFunction, Request, Response, Router } from 'express';
import UserController from '../controllers/userController';
import { authenticateJWT } from '../middleware/jwtAuthMiddleware';

class UserRouter {
  private _router = Router();
  private _controller = UserController;

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
      '/',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getUser(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
    this._router.get(
      '/getAll',
      authenticateJWT,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const result = await this._controller.getUsers(req);
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
          const result = await this._controller.addUser(req);
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
          const result = await this._controller.editUser(req);
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
          const result = await this._controller.deleteUser(req);
          res.status(200).json(result);
        } catch (error) {
          next(error);
        }
      }
    );
  }
}

export = new UserRouter().router;
