import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
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

  private verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject();
        else resolve(decoded);
      });
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

    const user = await this.userService.findUserByEmailAndPassword(loginUserDto.email, loginUserDto.password);

    if (!user) return res.status(401).json({ message: 'Incorrect email or password' });

    const token = this.signToken(user.id);
    return res.status(200).send({
      status: 'success',
      token,
    });
  }

  // Protected route.
  @Get()
  async getAllUsers(@Req() req: Request, @Res() res: Response) {
    let token: string;
    let decoded: any;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Proceed if we provided an autorization token.
    if (!token) return res.status(401).json({ message: 'You are not logged in!, Please log in to get access.' });
    try {
      decoded = await this.verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token!' });
    }

    // Token exists but user dosen't.
    const userExists = await this.userService.findUserById(decoded.id);
    if (!userExists) return res.status(401).json({ message: "User for this token dosen't exist." });

    const users = await this.userService.getUsers();
    // Once access granted.
    return res.json({ data: { users } });
  }

  @Post('/forgotPassword')
  async forgotPassword(@Req() req: Request, @Res() res: Response, @Body() userDto: UserDto) {
    const user = await this.userService.findUserByEmail(userDto.email);
    if (!user) return res.status(404).json({ message: 'User with email address not found' });

    const resetToken = await this.userService.createPasswordResetToken(user);

    return res.status(200).json({ data: { user } });
  }
}
