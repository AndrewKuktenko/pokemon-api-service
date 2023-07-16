import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserDocument } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh.token.dto';
import { UserService } from 'src/modules/user/user.service';
import { SessionService } from 'src/modules/session/session.service';
import { IAuthResult } from 'src/common/interfaces/auth.result';
import { ITokenPayload } from 'src/common/interfaces/token.payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly sessionService: SessionService,
  ) {}

  async signUp(dto: SignUpDto): Promise<IAuthResult> {
    const alreadyCreated = await this.userService.getUserByEmail(dto.email);
    if (alreadyCreated) {
      throw new HttpException('User already exist.', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.createUser({
      ...dto,
      password: hashedPassword,
    });

    try {
      const accessToken = this.generateToken(user);
      const { refreshToken } = await this.sessionService.addSession(user.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new HttpException(
        'Unknown Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateToken(user: UserDocument): string {
    const payload: ITokenPayload = {
      email: user.email,
      id: user._id,
    };

    return this.jwtService.sign(payload);
  }

  async signIn(dto: SignInDto): Promise<IAuthResult> {
    const user = await this.validate(dto);
    if (user.deleted)
      throw new UnauthorizedException({
        message: 'This account was deleted.',
      });

    try {
      const accessToken = this.generateToken(user);
      const { refreshToken } = await this.sessionService.addSession(user.id);
      return { accessToken, refreshToken };
    } catch (e) {
      throw new HttpException(
        'Unknown Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validate(dto: SignInDto): Promise<UserDocument> {
    const user = await this.userService.getUserByEmail(dto.email);
    const isEqual = await bcrypt.compare(dto.password, user.password);
    if (user && isEqual) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Unable to sign in. Wrong credentials.',
    });
  }

  async refreshToken(dto: RefreshTokenDto): Promise<IAuthResult> {
    const currentSession = await this.sessionService.findAndDelete(
      dto.refreshToken,
    );
    if (!currentSession)
      throw new UnauthorizedException({
        message: 'Invalid refresh token.',
      });

    try {
      const newSession = await this.sessionService.addSession(
        currentSession.user,
      );
      const user = await this.userService.getUserById(currentSession.user);
      const accessToken = this.generateToken(user);

      return { accessToken, refreshToken: newSession.refreshToken };
    } catch (err) {
      throw new HttpException(
        'Unknown Error.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
