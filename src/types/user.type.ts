import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/model/user.model';

@ObjectType()
export class UserResponse {
    @Field(() => User, { nullable: true })
    data?: User;

    @Field({ nullable: true })
    errors?: string;
}