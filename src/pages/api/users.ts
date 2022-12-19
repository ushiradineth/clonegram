import { type NextApiRequest, type NextApiResponse } from "next";

import { prisma } from "../../server/db/client";

const users = async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findMany();
  res.status(200).json(user);
};

export default users;
