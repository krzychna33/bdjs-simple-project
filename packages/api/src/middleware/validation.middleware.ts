import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

type ValidationTarget = 'body' | 'query';

export function validateDto(dtoClass: any, target: ValidationTarget = 'body') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToClass(dtoClass, req[target]);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      return res.status(400).json({
        status: 400,
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints
        }))
      });
    }

    req[target] = dtoObject;
    next();
  };
} 