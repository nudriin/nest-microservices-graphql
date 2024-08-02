import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterRequest {
    @Field()
    email: string;

    @Field()
    name: string;
    
    @Field()
    password: string;
}
