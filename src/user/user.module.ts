import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { UserResolver } from './user.resolver';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        CommonModule,
        ClientsModule.register([
            {
                name: 'USERS_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqp://localhost:5672'],
                    queue: 'users_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
            },
        ]),
    ],
    providers: [UserService, UserResolver],
})
export class UserModule {}
