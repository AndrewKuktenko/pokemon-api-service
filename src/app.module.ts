import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
