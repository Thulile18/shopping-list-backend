import { createServer, IncomingMessage, ServerResponse } from 'http';
import { ShoppingItem } from './models/item.js';
import { sendJson, parseJsonBody } from './utils/response.js';


// In-Memory Database
let shoppingItems: ShoppingItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: '2L',
    purchased: false,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: '12 pack',
    purchased: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Bread',
    quantity: 1,
    purchased: false,
    createdAt: new Date().toISOString()
  }
];

const PORT = 3000;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const { method, url } = req;
  
  // Enable CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // ---- GET /items (Sprint 2) ----
    if (url === '/items' && method === 'GET') {
      sendJson(res, 200, { success: true, data: shoppingItems });
      return;
    }

    // ---- POST /items (Sprint 2) ----
    if (url === '/items' && method === 'POST') {
      const body = await parseJsonBody<Partial<ShoppingItem>>(req);
      
      if (!body.name || !body.name.trim()) {
        sendJson(res, 400, {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'The property field "name" is required and cannot be empty.' }
        });
        return;
      }
      if (body.quantity === undefined || body.quantity === null || body.quantity === '') {
        sendJson(res, 400, {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'The property field "quantity" is required.' }
        });
        return;
      }

      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: body.name.trim(),
        quantity: body.quantity,
        purchased: body.purchased ?? false,
        createdAt: new Date().toISOString()
      };

      shoppingItems.push(newItem);
      sendJson(res, 201, { success: true, data: newItem });
      return;
    }

    // ---- DYNAMIC ROUTING: /items/:id (Sprints 3 & 4) ----
    if (url?.startsWith('/items/')) {
      const parts = url.split('/');
      const id = parts[2]; // Extracts the ID portion string from the URL path index

      if (!id || id.trim() === '') {
        sendJson(res, 400, {
          success: false,
          error: { code: 'BAD_REQUEST', message: 'Missing item identification parameter ID.' }
        });
        return;
      }

      const itemIndex = shoppingItems.findIndex(item => item.id === id);

      // ---- GET /items/:id (Sprint 3) ----
      if (method === 'GET') {
        if (itemIndex === -1) {
          sendJson(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `Shopping item with ID "${id}" could not be found.` }
          });
          return;
        }
        sendJson(res, 200, { success: true, data: shoppingItems[itemIndex] });
        return;
      }

      // ---- PUT /items/:id (Sprint 3) ----
      if (method === 'PUT') {
        if (itemIndex === -1) {
          sendJson(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `Shopping item with ID "${id}" could not be found.` }
          });
          return;
        }

        const body = await parseJsonBody<Partial<ShoppingItem>>(req);
        
        // Return validation errors if they clear name text fields incorrectly
        if (body.name !== undefined && !body.name.trim()) {
          sendJson(res, 400, {
            success: false,
            error: { code: 'VALIDATION_ERROR', message: 'The field "name" cannot be left blank.' }
          });
          return;
        }

        const currentItem = shoppingItems[itemIndex];
        const updatedItem: ShoppingItem = {
          ...currentItem,
          name: body.name !== undefined ? body.name.trim() : currentItem.name,
          quantity: body.quantity !== undefined ? body.quantity : currentItem.quantity,
          purchased: body.purchased !== undefined ? body.purchased : currentItem.purchased
        };

        shoppingItems[itemIndex] = updatedItem;
        sendJson(res, 200, { success: true, data: updatedItem });
        return;
      }

      // ---- DELETE /items/:id (Sprint 4) ----
      if (method === 'DELETE') {
        if (itemIndex === -1) {
          sendJson(res, 404, {
            success: false,
            error: { code: 'NOT_FOUND', message: `Shopping item with ID "${id}" could not be found.` }
          });
          return;
        }

        // Filter the selected item out of our data stack array configuration
        shoppingItems = shoppingItems.filter(item => item.id !== id);
        
        // Sprint 4 Exact Requirement: Return 204 No Content for a successful deletion
        res.writeHead(204);
        res.end();
        return;
      }
    }

    // ---- Fallback Catch-All Route 404 handler ----
    sendJson(res, 404, {
      success: false,
      error: { code: 'ROUTE_NOT_FOUND', message: `The request path "${url}" with method "${method}" is invalid.` }
    });

  } catch (error) {
    sendJson(res, 500, {
      success: false,
      error: { 
        code: 'INTERNAL_SERVER_ERROR', 
        message: error instanceof Error ? error.message : 'An unexpected pipeline tracking exception occurred.' 
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`[Shopping List API Upgraded] Sprints 1-5 active on http://localhost:${PORT}`);
});
