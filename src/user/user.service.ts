import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { LoginRequest, RegisterRequest } from '../dto/user.dto';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { LoginResponse, UserResponse } from '../types/user.type';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async register(request: RegisterRequest): Promise<UserResponse> {
        // validate request with validation service
        const validRequest: RegisterRequest = this.validationService.validate(
            UserValidation.REGISTER,
            request,
        ) as RegisterRequest; // casting validate to RegisterRequest

        const totalUser = await this.prismaService.user.count({
            where: {
                email: validRequest.email,
            },
        });

        if (totalUser != 0) {
            throw new BadRequestException('Email is exist');
        }

        validRequest.password = await bcrypt.hash(validRequest.password, 10);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await this.prismaService.user.create({
            data: validRequest,
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        return {
            user: user,
        };
    }

    async login(request: LoginRequest): Promise<LoginResponse> {
        const validRequest: LoginRequest = this.validationService.validate(
            UserValidation.LOGIN,
            request,
        ) as LoginRequest;

        const user = await this.prismaService.user.findFirst({
            where: {
                email: validRequest.email,
            },
        });

        if (!user) {
            throw new BadRequestException('Username or password is wrong');
        }

        const isPasswordValid = await bcrypt.compare(
            validRequest.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Username or password is wrong');
        }

        const token = this.jwtService.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            {
                expiresIn: '1d',
                secret: this.configService.get('JWT_SECRET'),
            },
        );

        return {
            token: token,
        };
    }
}
