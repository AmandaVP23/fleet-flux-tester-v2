export class TokenStore {
    async save(tokens: Tokens) {}

    async load(): Promise<Tokens | null> {}

    async clear() {}
}
// todo - write to a json
