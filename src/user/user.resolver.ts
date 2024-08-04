import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserResponse } from '../types/user.type';
import { RegisterRequest } from '../dto/user.dto';
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
