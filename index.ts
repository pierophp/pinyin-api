// import { PrismaClient } from '.prisma/client';

import { Router } from 'itty-router';
import { prisma } from './src/prisma';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get('/', async () => {
  const word = await prisma.cjk.findFirst({ where: { ideogram: '我們' } });

  return new Response(
    'Hello, world228d! This is the root page of your Worker template.',
  );
});

/*
This route demonstrates path parameters, allowing you to extract fragments from the request
URL.
Try visit /example/hello and see the response.
*/
router.get('/example/:text', ({ params }) => {
  // Decode text like "Hello%20world" into "Hello world"
  let input = decodeURIComponent(params!.text);

  // Construct a buffer from our input
  // @ts-ignore
  let buffer = Buffer.from(input, 'utf8');

  // Serialise the buffer into a base64 string
  let base64 = buffer.toString('base64');

  // Return the HTML with the string to the client
  return new Response(`<p>Base64 encoding: <code>${base64}</code></p>`, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
});

/*
This shows a different HTTP method, a POST.
Try send a POST request using curl or another tool.
Try the below curl command to send JSON:
$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
router.post('/post', async request => {
  // Create a base object with some fields.

  let fields = {
    // @ts-ignore
    asn: request.cf.asn,
    // @ts-ignore
    colo: request.cf.colo,
  };

  // If the POST data is JSON then attach it to our response.
  // @ts-ignore
  if (request.headers.get('Content-Type') === 'application/json') {
    // @ts-ignore
    fields['json'] = await request.json();
  }

  // Serialise the JSON to a string.
  const returnData = JSON.stringify(fields, null, 2);

  return new Response(returnData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
  async fetch(request: Request, env: any, ctx: ExecutionContext) {
    return router.handle(request);
  },
};
