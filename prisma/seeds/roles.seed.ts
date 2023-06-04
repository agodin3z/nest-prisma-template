import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcrypt';

export default async (prisma: PrismaClient): Promise<any> => {
  const roles = [
    {
      name: 'root',
      createdBy: 'seed',
      users: {
        create: [
          {
            username: 'root',
            password: hashSync('Root1234', 10),
            active: true,
            firstname: 'Root',
            lastname: 'User',
            email: 'root.us3r@yopmail.com',
            photo: 'https://www.placecage.com/220/220?random=3',
            gender: 'M',
            createdBy: 'seed',
          },
        ],
      },
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      create: role,
      update: {},
      where: { name: role.name },
    });
  }
};
