import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    let token: string;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
      token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'You are not logged in!, Please log in to get access' });

    try {
      const decoded = await this.verifyToken(token);
      console.log(decoded);
      next();
    } catch (error) {}
  }

  private verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject();
        else resolve(decoded);
      });
    });
  }
}
