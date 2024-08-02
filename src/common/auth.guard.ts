import {
    CanActivate,
    ExecutionContext,
    HttpException,
    Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
// import { Observable } from 'rxjs';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private prismaService: PrismaService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context); // mengambil kontext graphql yang berisi request (req)
        const { req } = ctx.getContext(); // mengambil request dari kontext graphql

        // mengambil authorization header yang dikirim client
        const authorization = req.headers.authorization as string;
        if (!authorization) {
            throw new HttpException('Unauthorized', 401);
        }
        try {
            const token = authorization.split(' ')[1];

            const payload = this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_SECRET'),
            });

            const user = await this.prismaService.user.findUnique({
                where: {
                    id: payload.id,
                },
            });

            if (!user) {
                throw new HttpException('Unauthorized', 401);
            } else {
                req.user = user;
            }
        } catch (error) {
            throw new HttpException('Unauthorized', 401);
        }

        return true;
    }
}
