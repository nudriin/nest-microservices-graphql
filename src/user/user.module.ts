import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../common/common.module';
import { UserResolver } from './user.resolver';

@Module({
    imports: [CommonModule],
    providers: [UserService, UserResolver],
})
export class UserModule {}
