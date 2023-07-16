import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { SessionModule } from 'src/modules/session/session.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/common/strategies/jwt-strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super_secret',
      signOptions: {
        expiresIn: '12h',
      },
    }),
    UserModule,
    SessionModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
