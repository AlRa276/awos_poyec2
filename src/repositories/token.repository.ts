import { prisma } from '@/lib/prisma';

export const tokenRepository = {
  revoke: (token: string, idUsuario: number, expiraEn: Date | null) =>
    prisma.tokenRevocado.create({
      data: { token, idUsuario, expiraEn: expiraEn ?? undefined },
    }),

  isRevoked: async (token: string) => {
    const found = await prisma.tokenRevocado.findFirst({ where: { token } });
    return !!found;
  },
};
