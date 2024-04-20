import { HttpException, Injectable } from '@nestjs/common';
import { SafeParseError, ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(data: T, schema: ZodType): T {
    const res = schema.safeParse(data);
    if (res.success) {
      return res.data;
    } else {
      throw new HttpException((res as SafeParseError<any>).error.message, 400);
    }
  }
}
