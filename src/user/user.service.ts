import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { RegisterRequest } from '../dto/user.dto';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '../model/user.model';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private validationService: ValidationService,
    ) {}

    async register(request: RegisterRequest): Promise<User> {
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
            throw new HttpException('Email is exist', 400);
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

        return user;
    }
}
