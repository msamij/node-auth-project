import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  private signToken(id: number) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  }

  @Post('/signup')
  async signup(@Body() signupUserDto: UserDto, @Res() res: Response) {
    if (signupUserDto.password !== signupUserDto.confirmPassword)
      return res.status(400).json({
        message: 'The two password fields do not match',
      });

    const newUser = await this.userService.createUser(signupUserDto);
    const token = this.signToken(newUser.id);
    return res.status(201).json({
      token,
      data: {
        user: newUser,
      },
    });
  }

  @Post('/login')
  async login(@Body() loginUserDto: UserDto, @Res() res: Response) {
    const { email, password } = loginUserDto;
    if (!email || !password)
      return res.status(400).json({
        message: 'Please provide valid email and password',
      });

    const user = await this.userService.getUserBasedOnEmail(loginUserDto.email, loginUserDto.password);

    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

    return res.status(200).send({
      data: user,
    });
  }

  @Get()
  async getAllUsers() {
    return this.userService.getUsers();
  }
}
