import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(private configService: ConfigService) {}

  @Get()
  @Render('index')
  main() {
    const apiUrl = this.configService.get<string>('apiUrl');

    return { apiUrl };
  }
}
