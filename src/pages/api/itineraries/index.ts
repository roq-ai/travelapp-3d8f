import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { itineraryValidationSchema } from 'validationSchema/itineraries';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getItineraries();
    case 'POST':
      return createItinerary();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getItineraries() {
    const data = await prisma.itinerary
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'itinerary'));
    return res.status(200).json(data);
  }

  async function createItinerary() {
    await itineraryValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.budget?.length > 0) {
      const create_budget = body.budget;
      body.budget = {
        create: create_budget,
      };
    } else {
      delete body.budget;
    }
    if (body?.todo?.length > 0) {
      const create_todo = body.todo;
      body.todo = {
        create: create_todo,
      };
    } else {
      delete body.todo;
    }
    const data = await prisma.itinerary.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
