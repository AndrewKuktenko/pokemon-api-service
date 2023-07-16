import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 16)
  password: string;
}
