import { AppContext } from '../../../shared/controller/appContext';
import { prisma } from '../../../prisma';
import { PushTokenDelete } from '../pushTokenSchemas';
import { Error401 } from '../../../shared/errors/Error401';

export async function pushTokenDeleteController(
  data: PushTokenDelete,
  context: AppContext,
) {
  const { currentUser } = context;

  if (!currentUser) {
    throw new Error401();
  }

  const pushToken = await prisma.pushToken.deleteMany({
    where: {
      userId: currentUser.id,
      token: data.token,
    },
  });

  return { deleted: pushToken.count > 0 };
}
