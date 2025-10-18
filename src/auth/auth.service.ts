import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Registro de usuario
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email already in use');

    // Si no se pasa roleId, asigna rol "User" por defecto
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
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName1: true,
        roleId: true,
        role: { select: { name: true } },
      },
    });

    // Generar token inmediatamente tras registrarse
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { user, access_token: token };
  }

  // Login de usuario
  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.roleId,
      role: user.role.name,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });

    return { access_token: token, role: user.role.name };
  }

  // Método opcional: Validar token / usuario
  async validateUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName1: true,
        roleId: true,
        role: { select: { name: true } },
      },
    });
  }
}
