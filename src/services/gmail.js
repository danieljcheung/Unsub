const GMAIL_API_BASE = 'https://www.googleapis.com/gmail/v1/users/me';

export async function fetchEmailsWithUnsubscribe(accessToken, onProgress, maxResults = 500) {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const allMessages = [];
  let pageToken = null;
  let fetchedCount = 0;

  // Fetch message IDs with pagination
  do {
    const url = new URL(`${GMAIL_API_BASE}/messages`);
    url.searchParams.set('maxResults', '100');
    url.searchParams.set('q', 'unsubscribe'); // Filter to emails likely having unsubscribe
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken);
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.messages) {
      allMessages.push(...data.messages);
      fetchedCount += data.messages.length;
      onProgress?.({ phase: 'listing', count: fetchedCount });
    }

    pageToken = data.nextPageToken;
  } while (pageToken && allMessages.length < maxResults);

  // Fetch message details in batches
  const batchSize = 20;
  const messagesWithHeaders = [];

  for (let i = 0; i < allMessages.length; i += batchSize) {
    const batch = allMessages.slice(i, i + batchSize);
    const details = await Promise.all(
      batch.map((msg) => fetchMessageHeaders(accessToken, msg.id))
    );
    messagesWithHeaders.push(...details.filter(Boolean));
    onProgress?.({
      phase: 'fetching',
      current: Math.min(i + batchSize, allMessages.length),
      total: allMessages.length,
    });
  }

  return messagesWithHeaders;
}

async function fetchMessageHeaders(accessToken, messageId) {
  const url = new URL(`${GMAIL_API_BASE}/messages/${messageId}`);
  url.searchParams.set('format', 'metadata');
  url.searchParams.set(
    'metadataHeaders',
    'From,List-Unsubscribe,List-Unsubscribe-Post,Subject'
  );

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) return null;

  const data = await response.json();
  const headers = data.payload?.headers || [];

  const getHeader = (name) =>
    headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value;

  const listUnsubscribe = getHeader('List-Unsubscribe');
  if (!listUnsubscribe) return null;

  return {
    id: messageId,
    from: parseFromHeader(getHeader('From')),
    subject: getHeader('Subject'),
    unsubscribeHeader: listUnsubscribe,
    unsubscribePost: getHeader('List-Unsubscribe-Post'),
    date: new Date(parseInt(data.internalDate)),
  };
}

function parseFromHeader(from) {
  if (!from) return { name: 'Unknown', email: 'unknown@unknown.com' };

  // Match patterns like "Name <email@domain.com>" or just "email@domain.com"
  const match = from.match(/^(?:"?([^"<]*)"?\s*)?<?([^>]+@[^>]+)>?$/);

  if (match) {
    return {
      name: match[1]?.trim() || match[2],
      email: match[2].toLowerCase(),
    };
  }

  return { name: from, email: from };
}

export function parseUnsubscribeLinks(header) {
  if (!header) return { httpUrl: null, mailto: null };

  const links = { httpUrl: null, mailto: null };

  // Extract URLs from angle brackets
  const matches = header.match(/<([^>]+)>/g);
  if (matches) {
    for (const match of matches) {
      const url = match.slice(1, -1);
      if (url.startsWith('http://') || url.startsWith('https://')) {
        links.httpUrl = url;
      } else if (url.startsWith('mailto:')) {
        links.mailto = url;
      }
    }
  }

  return links;
}

export function groupBySender(messages) {
  const groups = new Map();

  for (const msg of messages) {
    const key = msg.from.email;
    if (!groups.has(key)) {
      groups.set(key, {
        email: msg.from.email,
        name: msg.from.name,
        messages: [],
        unsubscribeLinks: parseUnsubscribeLinks(msg.unsubscribeHeader),
        hasOneClickUnsubscribe: !!msg.unsubscribePost,
      });
    }
    groups.get(key).messages.push(msg);
  }

  // Sort by message count (most emails first)
  return Array.from(groups.values()).sort(
    (a, b) => b.messages.length - a.messages.length
  );
}

export function getSenderLogo(email) {
  const domain = email.split('@')[1];
  if (!domain) return null;
  // Use Clearbit Logo API (free, no auth required)
  return `https://logo.clearbit.com/${domain}`;
}
