import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse } from 'src/types/user.type';
import { RegisterRequest } from 'src/dto/user.dto';
import { User } from '../model/user.model';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UserResponse)
    async register(
        @Args('request') request: RegisterRequest,
    ): Promise<UserResponse> {
        const user = await this.userService.register(request);

        return {
            data: user,
        };
    }

    @Query(() => [User])
    async getAllUsers() {}
}
