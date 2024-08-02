import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { APP_FILTER } from '@nestjs/core';
import { ErrorFilter } from './error.filter';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            playground: true,
            context: ({ req, res }) => ({ req, res }),
            formatError: (err) => ({
                message: err.message,
                status: err.extensions.code,
            }),
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    providers: [
        AuthGuard,
        PrismaService,
        ValidationService,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter,
        },
    ],
    exports: [AuthGuard, PrismaService, ValidationService],
})
export class CommonModule {}
