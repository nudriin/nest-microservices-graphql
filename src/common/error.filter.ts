import {
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
    catch(exception: any) {
        if (exception instanceof HttpException) {
            throw new HttpException(exception.message, exception.getStatus());
        } else if (exception instanceof ZodError) {
            throw new BadRequestException(
                exception.errors
                    .map((value) => {
                        return value.message;
                    })
                    .join(', '),
            );
        } else {
            throw new InternalServerErrorException(exception.message);
        }
    }
}
