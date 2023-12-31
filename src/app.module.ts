import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import paginationConfig from 'config/pagination.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
      load: [paginationConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: process.env.MONGO_CONNECTION_URL,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    PokemonModule,
    AuthModule,
    UserModule,
    SessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
