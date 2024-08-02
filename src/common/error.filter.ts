import {
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: any) {
        if (exception instanceof HttpException) {
            throw new HttpException(exception.message, exception.getStatus());
        } else if (exception instanceof ZodError) {
            throw new HttpException(
                exception.errors
                    .map((value) => {
                        return value.message;
                    })
                    .join(', '),
                HttpStatus.BAD_REQUEST,
            );
        } else {
            throw new HttpException(exception.message, 500);
        }
    }
}
