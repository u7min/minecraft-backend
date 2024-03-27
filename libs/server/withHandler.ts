import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type method = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface ConfigType {
  methods: method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => void;
  isPrivate?: boolean;
}
export default function withHandler({ methods, isPrivate = true, handler }: ConfigType) {
  return async function (req: NextApiRequest, res: NextApiResponse): Promise<any> {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }

    try {
      await handler(req, res);
    } catch (error: any) {
      return res.status(500).json({ ok: false, error: error.message ? error.message : error });
    }
  };
}
