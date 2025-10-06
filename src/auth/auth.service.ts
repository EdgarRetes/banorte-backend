import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

    // If roleId not provided, use / create 'User' role
    let roleId = dto.roleId;
    if (!roleId) {
      let role = await this.prisma.role.findUnique({ where: { name: 'User' } });
      if (!role) {
        role = await this.prisma.role.create({ data: { name: 'User' } });
      }
      roleId = role.id;
    }

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        middleName: dto.middleName,
        lastName1: dto.lastName1,
        lastName2: dto.lastName2,
        email: dto.email,
        password: hashed,
        roleId,
      },
      // avoid returning the password
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName1: true,
        roleId: true,
      },
    });

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return { access_token: this.jwtService.sign(payload, { expiresIn: '1h' }) };
  }

  // Optional helper: validate user (returns user without password)
  async validateUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName1: true, roleId: true },
    });
    return user;
  }
}
