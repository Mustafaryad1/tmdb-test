import * as crypto from 'crypto';

export function generateHash(query: string): string {
    return crypto.createHash('sha256').update(query).digest('hex');
}