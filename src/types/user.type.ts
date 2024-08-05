import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../model/user.model';

@ObjectType()
export abstract class BaseResponse {
    @Field({ nullable: true })
    errors?: string;
}
@ObjectType()
export class UserResponse extends BaseResponse {
    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class LoginResponse extends BaseResponse {
    @Field({ nullable: true })
    token?: string;
}
