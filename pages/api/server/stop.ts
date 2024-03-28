import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import { PubSub } from '@google-cloud/pubsub';
import * as Compute from '@google-cloud/compute';

const projectId = process.env.GCP_PROJECT_ID;
const zone = process.env.GCP_ZONE;
const keyFile = process.env.GCP_KEY;
const instance = process.env.MINE_SERVER_NAME;
const onGcp = process.env.ON_GCP;

async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const computeClient =
    onGcp === 'true'
      ? new Compute.v1.InstancesClient()
      : new Compute.v1.InstancesClient({ projectId, keyFile });
  const response = await computeClient.stop({ project: projectId, zone, instance });
  const result = response?.[0].result;
  const error = response?.[0].error;

  res.json({
    ok: true,
    data: {
      result,
      error,
    },
  });
}

export default withHandler({
  methods: ['PUT'],
  handler,
});
