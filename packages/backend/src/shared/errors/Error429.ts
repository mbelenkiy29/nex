export class Error429 extends Error {
  code = 429;
  retryAfterSeconds?: number;

  constructor(message?: string, retryAfterSeconds?: number) {
    super(message);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
