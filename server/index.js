import { createServer } from 'node:http';
import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const usersFile = path.join(dataDir, 'users.json');
const messagesFile = path.join(dataDir, 'messages.json');

mkdirSync(dataDir, { recursive: true });
if (!existsSync(usersFile)) writeFileSync(usersFile, '[]', 'utf8');
if (!existsSync(messagesFile)) writeFileSync(messagesFile, '[]', 'utf8');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  response.end(JSON.stringify(payload));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        request.destroy();
        reject(new Error('Payload too large'));
      }
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    request.on('error', reject);
  });
}

function hashPassword(password, salt = randomUUID()) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const candidate = scryptSync(password, salt, 64);
  const target = Buffer.from(hash, 'hex');
  return candidate.length === target.length && timingSafeEqual(candidate, target);
}

async function maybeSendEmail(message) {
  const receiver = process.env.RADAR_RECEIVER_EMAIL || 'radarrgai@gmail.com';
  const emailUser = process.env.GMAIL_USER;
  const emailPass = process.env.GMAIL_APP_PASSWORD;

  if (!emailUser || !emailPass) {
    return { emailSent: false, reason: 'Email environment variables are not configured.' };
  }

  try {
    const nodemailer = await import('nodemailer');
    const transporter = nodemailer.default.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: emailUser,
      to: receiver,
      replyTo: message.email,
      subject: `Website inquiry from ${message.name}`,
      text: `Name: ${message.name}\nEmail: ${message.email}\nPhone: ${message.phone}\n\nMessage:\n${message.message}`,
    });

    return { emailSent: true };
  } catch (error) {
    return { emailSent: false, reason: error.message };
  }
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    json(response, 404, { message: 'Not found' });
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    });
    response.end();
    return;
  }

  const { pathname } = new URL(request.url, 'http://localhost');

  try {
    if (request.method === 'GET' && pathname === '/api/health') {
      json(response, 200, { ok: true });
      return;
    }

    if (request.method === 'POST' && pathname === '/api/register') {
      const body = await parseBody(request);
      const users = readJson(usersFile);
      const email = String(body.email || '').trim().toLowerCase();

      if (!body.name || !email || !body.phone || !body.password) {
        json(response, 400, { message: 'Name, email, phone, and password are required.' });
        return;
      }

      if (users.some((user) => user.email === email)) {
        json(response, 409, { message: 'User with this email already exists.' });
        return;
      }

      const passwordRecord = hashPassword(body.password);
      const newUser = {
        id: randomUUID(),
        name: String(body.name).trim(),
        email,
        phone: String(body.phone).trim(),
        salt: passwordRecord.salt,
        passwordHash: passwordRecord.hash,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      writeJson(usersFile, users);

      json(response, 201, {
        message: 'Registration completed.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone },
      });
      return;
    }

    if (request.method === 'POST' && pathname === '/api/login') {
      const body = await parseBody(request);
      const users = readJson(usersFile);
      const email = String(body.email || '').trim().toLowerCase();
      const user = users.find((item) => item.email === email);

      if (!user || !verifyPassword(String(body.password || ''), user.salt, user.passwordHash)) {
        json(response, 401, { message: 'Invalid email or password.' });
        return;
      }

      json(response, 200, {
        message: 'Login completed.',
        user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      });
      return;
    }

    if (request.method === 'POST' && pathname === '/api/contact') {
      const body = await parseBody(request);
      if (!body.name || !body.email || !body.phone || !body.message) {
        json(response, 400, { message: 'All fields are required.' });
        return;
      }

      const messages = readJson(messagesFile);
      const newMessage = {
        id: randomUUID(),
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone).trim(),
        message: String(body.message).trim(),
        createdAt: new Date().toISOString(),
      };
      messages.push(newMessage);
      writeJson(messagesFile, messages);

      const emailResult = await maybeSendEmail(newMessage);
      json(response, 200, {
        message: 'Message saved.',
        emailSent: emailResult.emailSent,
        emailReason: emailResult.reason || null,
      });
      return;
    }

    json(response, 404, { message: 'Not found' });
  } catch (error) {
    json(response, 500, { message: error.message || 'Server error' });
  }
});

const port = Number(process.env.PORT || 3001);
server.listen(port, () => {
  console.log(`API server is running on http://localhost:${port}`);
});
