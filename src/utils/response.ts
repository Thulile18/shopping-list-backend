import { IncomingMessage, ServerResponse } from 'http';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const sendJson = (res: ServerResponse, statusCode: number, payload: ApiResponse) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
};

export const parseJsonBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: Buffer) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (!body) {
          resolve({} as T);
          return;
        }
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON structure.'));
      }
    });
    req.on('error', (err: Error) => reject(err));
  });
};
