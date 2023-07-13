import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { todoValidationSchema } from 'validationSchema/todos';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.todo
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTodoById();
    case 'PUT':
      return updateTodoById();
    case 'DELETE':
      return deleteTodoById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTodoById() {
    const data = await prisma.todo.findFirst(convertQueryToPrismaUtil(req.query, 'todo'));
    return res.status(200).json(data);
  }

  async function updateTodoById() {
    await todoValidationSchema.validate(req.body);
    const data = await prisma.todo.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTodoById() {
    const data = await prisma.todo.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
