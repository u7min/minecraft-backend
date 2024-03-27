const { PubSub } = require('@google-cloud/pubsub');
const Compute = require('@google-cloud/compute');

const projectId = 'sunny-caldron-228302';
const zone = 'asia-northeast3-a';
const instance = 'instance-20240217-081407';
const keyFile = 'minecraft-backend.json';

const processMessage = () => {
  const pubSubClient = new PubSub({
    projectId,
    keyFile,
  });
  const computeClient = new Compute.v1.InstancesClient({ projectId, keyFile });
  const subscription = pubSubClient.subscription('mine-server-event-sub');
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}`);
    console.log(`\tData: ${message.data}`);
    const data = message.data ? Buffer.from(message.data, 'base64').toString() : '{}';
    const jsonData = JSON.parse(data);
    if (jsonData?.action === 'start') {
      computeClient
        .start({ project: projectId, zone, instance })
        .then(() => console.log('Started'))
        .catch((e) => console.log(e));
    } else if (jsonData?.action === 'stop') {
      console.log('Stopped');
    }
  };
  subscription.on('message', messageHandler);
  subscription.on('error', (e) => {
    console.error(e);
  });
};

processMessage();
