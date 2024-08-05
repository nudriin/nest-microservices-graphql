import { z } from 'zod';

export class UserValidation {
    static readonly REGISTER = z.object({
        email: z.string().email().min(1).max(225),
        password: z.string().min(1).max(225),
        name: z.string().min(1).max(225),
    });

    static readonly LOGIN = z.object({
        email: z.string().email().min(1).max(225),
        password: z.string().min(1).max(225),
    });

    static readonly UPDATE = z.object({
        name: z.string().min(1).max(225).optional(),
        oldPassword: z.string().min(1).max(225).optional(),
        newPassword: z.string().min(1).max(225).optional(),
    });

    static readonly USER = z.object({
        id: z.number().min(1),
        email: z.string().email().min(1).max(225),
        name: z.string().min(1).max(225),
    });
}
