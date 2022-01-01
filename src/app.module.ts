import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieController } from './Controllers/movie/movie.controller';
import { MovieService } from './services/movie/movie.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    CacheModule.register(),
  ],
  controllers: [AppController, MovieController],
  providers: [AppService, MovieService],
  exports: [],
})
export class AppModule {}
