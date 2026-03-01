import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodType<T, any, any>) {}

  transform(value: unknown): T {
    try {
      return this.schema.parse(value) as T;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        console.error('Zod validation error details:', error.issues);
        throw new BadRequestException({
          message: 'Validation failed',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          errors: (error as any).issues,
        });
      }
      throw new BadRequestException('Validation failed');
    }
  }
}
