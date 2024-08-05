import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { LoginResponse, UserResponse } from '../types/user.type';
import { LoginRequest, RegisterRequest } from '../dto/user.dto';
import { User } from '../model/user.model';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/auth.guard';
import { Auth } from '../common/auth.decorator';

@Resolver('User')
export class UserResolver {
    constructor(private userService: UserService) {}

    @Mutation(() => UserResponse)
    async register(
        @Args('request') request: RegisterRequest,
    ): Promise<UserResponse> {
        const user = await this.userService.register(request);

        return user;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args('request') request: LoginRequest,
    ): Promise<LoginResponse> {
        const result = await this.userService.login(request);

        return result;
    }

    @Query(() => UserResponse)
    @UseGuards(AuthGuard)
    async getCurrent(@Auth() user: User): Promise<UserResponse> {
        const result = await this.userService.getCurrent(user);

        return result;
    }

    @Query(() => [User])
    async getAllUsers() {}
}
