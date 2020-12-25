export class NoContentError extends Error {
  constructor() {
    super('Page has no content');
  }
}
