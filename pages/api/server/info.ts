import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import * as Compute from '@google-cloud/compute';
import axios from 'axios';

const projectId = process.env.GCP_PROJECT_ID;
const zone = process.env.GCP_ZONE;
const keyFile = process.env.GCP_KEY;
const instance = process.env.MINE_SERVER_NAME;
const onGcp = process.env.ON_GCP;

export interface McStatusResponse {
  online: boolean;
  players: { list: string[] };
  motd: { clean: string };
}

export interface ServiceResponse {
  status: string;
  ip: string;
  service: {
    online: boolean;
    players: any[];
    name: string;
  };
}

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const computeClient =
    onGcp === 'true'
      ? new Compute.v1.InstancesClient()
      : new Compute.v1.InstancesClient({ projectId, keyFile });
  const response = await computeClient.get({ project: projectId, zone, instance });
  const status = response?.[0].status;
  const networkInterfaces = response?.[0].networkInterfaces;
  const ip = networkInterfaces?.[0].accessConfigs?.[0].natIP;

  if (ip) {
    const response = await axios.get<McStatusResponse>(
      `https://api.mcstatus.io/v2/status/java/${ip}`,
    );
    return res.json({
      ok: true,
      data: {
        status,
        ip,
        service: {
          online: response?.data?.online,
          players: response?.data?.players?.list,
          name: response?.data?.motd?.clean,
        },
      },
    });
  }

  return res.json({
    ok: true,
    data: {
      status,
      ip,
    },
  });
}

export default withHandler({
  methods: ['GET'],
  handler,
});
