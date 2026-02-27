// 🔥 Conversațiile pentru vânzător sau cumpărător
getConversationsForUser(userId: number) {
  return this.prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    orderBy: { updatedAt: 'desc' },

    // 🔥 FIX: includem TOT ce are nevoie frontend-ul
    include: {
      buyer: {
        select: { id: true, name: true, email: true },
      },
      seller: {
        select: { id: true, name: true, email: true },
      },
      product: {
        select: { id: true, name: true, price: true },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { text: true, createdAt: true },
      },
    },
  });
}
