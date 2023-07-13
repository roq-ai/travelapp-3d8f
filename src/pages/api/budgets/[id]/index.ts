import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { budgetValidationSchema } from 'validationSchema/budgets';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.budget
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBudgetById();
    case 'PUT':
      return updateBudgetById();
    case 'DELETE':
      return deleteBudgetById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBudgetById() {
    const data = await prisma.budget.findFirst(convertQueryToPrismaUtil(req.query, 'budget'));
    return res.status(200).json(data);
  }

  async function updateBudgetById() {
    await budgetValidationSchema.validate(req.body);
    const data = await prisma.budget.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBudgetById() {
    const data = await prisma.budget.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
