import { GraphQLError } from 'graphql';

export class ValidationException extends GraphQLError {
    constructor(message: string, status: number) {
        const options = {
            extensions: {
                timestamp: new Date().toLocaleString('id-ID', {
                    timeZone: 'Asia/Jakarta',
                }),
                status: status,
            },
        };
        super(message, options);
    }
}
