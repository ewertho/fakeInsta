import { prisma } from "../../lib/prisma.js";

export async function listMessagePreviews(userId: string) {
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
    take: 200,
  });

  const seen = new Map<
    string,
    (typeof messages)[number]
  >();

  for (const message of messages) {
    const otherId = message.senderId === userId ? message.receiverId : message.senderId;
    if (!seen.has(otherId)) {
      seen.set(otherId, message);
    }
  }

  return Array.from(seen.values()).map((message) => {
    const other = message.senderId === userId ? message.receiver : message.sender;
    const unread = message.receiverId === userId && !message.readAt;

    return {
      id: message.id,
      other: {
        id: other.id,
        username: other.username,
        avatarUrl: other.avatarUrl,
      },
      snippet: message.body,
      createdAt: message.createdAt.toISOString(),
      unread,
    };
  });
}
