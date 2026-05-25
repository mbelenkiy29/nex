import app from '../packages/backend/dist/app.js';

async function handleRequest(req) {
  return app.fetch(req);
}

export function GET(req) {
  return handleRequest(req);
}
export function POST(req) {
  return handleRequest(req);
}
export function PUT(req) {
  return handleRequest(req);
}
export function DELETE(req) {
  return handleRequest(req);
}
export function PATCH(req) {
  return handleRequest(req);
}
