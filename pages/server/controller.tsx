import { NextPage } from 'next';
import useSWR from 'swr';
import useMutation from '@libs/client/useMutation';
import minecraft from '../../public/minecraft.png';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ServiceResponse } from '../api/server/info';

interface ServerInfoResponse {
  ok: boolean;
  error?: string;
  data?: ServiceResponse;
}

const Controller: NextPage = () => {
  const { data: serverInfo, isLoading } = useSWR<ServerInfoResponse>('/api/server/info', {
    refreshInterval: 10000,
  });
  const [message, setMessage] = useState('');
  const [start, { loading: starting }] = useMutation('PUT', '/api/server/start');
  const [stop, { loading: stopping }] = useMutation('PUT', '/api/server/stop');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [canStop, setCanStop] = useState(false);

  useEffect(() => {
    if (isLoading || starting || stopping) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [isLoading, starting, stopping]);

  useEffect(() => {
    if (serverInfo?.data?.status && !['TERMINATED', 'RUNNING'].includes(serverInfo.data.status)) {
      setLoading(true);
      setCanStart(false);
      setCanStop(false);
    } else if (serverInfo?.data?.status === 'TERMINATED') {
      setLoading(false);
      setCanStart(true);
      setMessage('');
    } else if (serverInfo?.data?.status === 'RUNNING') {
      setLoading(false);
      setCanStop(true);
      setMessage('');
    }
  }, [serverInfo?.data?.status]);

  useEffect(() => {
    if (serverInfo?.error) {
      setError(serverInfo.error);
    }
  }, [serverInfo]);

  const handleStart = () => {
    start(null);
    setMessage('Start Requested. Please wait...');
  };
  const handleStop = () => {
    stop(null);
    setMessage('Stop Requested. Please wait...');
  };

  const handleCopyClipBoard = async () => {
    if (serverInfo?.data?.ip) {
      await navigator.clipboard.writeText(serverInfo.data.ip);
      setMessage('Copied Server IP!');
    }
  };

  return (
    <div
      className={`w-full flex flex-row justify-between h-screen text-green-500 ${loading ? 'opacity-50' : 'bg-black'} text-sm`}
    >
      <div className="text-white"></div>
      <div className={`p-5 max-w-xl w-full h-full`}>
        <div className="flex flex-col space-y-2 h-full">
          {error && <div className="h-8 text-xs">{error}</div>}
          <div className="h-8 text-xs">{loading ? 'Loading... ' : message}</div>
          <div className="h-full w-full text-center flex flex-row justify-between">
            <div></div>
            <div className="max-w-sm py-3">
              <Image src={minecraft} className="rounded-full" />
            </div>
            <div></div>
          </div>
          <div className="border border-green-500 h-14 p-2 text-center flex flex-col justify-between">
            <div></div>
            <div>
              {serverInfo?.data?.status
                ? `VM ${serverInfo.data.status}`
                : loading
                  ? 'LOADING'
                  : '-'}
            </div>
            <div></div>
          </div>
          <div className="border border-green-500 h-14 p-2 text-center flex flex-col justify-between">
            <div></div>
            <div>
              {serverInfo?.data?.service?.online ? (
                'SERVICE ONLINE'
              ) : (
                <div>
                  {loading ? 'LOADING' : <span className="text-red-500">SERVICE OFFLINE</span>}
                </div>
              )}
            </div>
            <div></div>
          </div>
          <div className="border border-green-500 h-14 p-2 text-center flex flex-col justify-between">
            <div></div>
            <div className="uppercase">
              {serverInfo?.data?.service?.name ? (
                <span className="">{serverInfo?.data?.service?.name}</span>
              ) : loading ? (
                'LOADING'
              ) : (
                '-'
              )}
            </div>
            <div></div>
          </div>
          <div className="border border-green-500 h-14 p-2 text-center flex flex-col justify-between">
            <div></div>
            <div className="uppercase">
              {serverInfo?.data?.service?.players?.length ? (
                <div>
                  <span className="">
                    {serverInfo?.data?.service?.players.map((p) => p.name_clean).join(',')}
                  </span>
                  <span> connected</span>
                </div>
              ) : (
                <div>
                  {loading ? 'LOADING' : <span className="text-yellow-500">NOBODY CONNECTED</span>}
                </div>
              )}
            </div>
            <div></div>
          </div>
          <div
            className={`border border-green-500 h-14 p-2 text-center flex flex-col justify-between  ${serverInfo?.data?.ip && 'cursor-pointer hover:bg-green-500 hover:text-black'}`}
            onClick={handleCopyClipBoard}
          >
            <div></div>
            <div>
              {serverInfo?.data?.ip ? (
                serverInfo.data.ip
              ) : loading ? (
                'LOADING'
              ) : (
                <span className="text-yellow-500">IP NOT FOUND</span>
              )}
            </div>
            <div></div>
          </div>
          <div className="flex flex-row space-x-2 h-14">
            <div
              className={`border border-green-500 w-1/2 p-2 text-center flex flex-col justify-between ${!canStart ? 'disabled cursor-not-allowed text-green-800 ring' : 'cursor-pointer hover:bg-green-500 hover:text-black'}`}
              onClick={!canStart ? undefined : handleStart}
            >
              <div></div>
              <div>Start</div>
              <div></div>
            </div>
            <div
              className={`border border-green-400 w-1/2 p-2 text-center flex flex-col justify-between ${!canStop ? 'disabled cursor-not-allowed text-green-800 ring' : 'cursor-pointer hover:bg-red-400 hover:text-black'}`}
              onClick={!canStop ? undefined : handleStop}
            >
              <div></div>
              <div>Stop</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Controller;
