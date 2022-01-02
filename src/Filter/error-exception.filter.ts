import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode =
      (typeof exception.getStatus !== 'undefined' && exception.getStatus()) ||
      HttpStatus.BAD_REQUEST;

    const responseBody = (typeof exception.getResponse !== 'undefined' &&
      exception.getResponse()) || {
      error: exception.message,
      statusCode,
    };

    response.status(statusCode).json(responseBody);
  }
}
