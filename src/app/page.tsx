"use client"

import { useState } from "react";
import classNames from "classnames";
import Image from "next/image";
import { parseCookies, setCookie } from 'nookies'
import { Request } from "./request";
import { Response } from "./response";

export default function Home() {
  const [connectedServer, setConnectedServer] = useState<boolean>(false);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [serverAddress, setServerAddress] = useState<string>(parseCookies().serverAddress);
  const [authenticationToken, setAuthenticationToken] = useState<string>(parseCookies().authenticateToken);
  const [connection, setConnection] = useState<WebSocket | null>(null);

  function connectServer() {
    if (!serverAddress) return;

    const connection = new WebSocket(serverAddress);

    connection.onerror = console.error;
    connection.onclose = (ev) => {
      console.log('close');
      setConnectedServer(false);
    };
    connection.onopen = (ev) => {
      console.log(ev);
      setConnectedServer(true);
      setCookie(null, "serverAddress", serverAddress);
    }
    connection.onmessage = (ev) => {
      console.log(ev.data);

      const json = JSON.parse(ev.data) as Response;

      switch (json.messageType) {
        case 'AuthenticationTokenResponse':
          authenticationTokenResponse(json)
          break;
        case 'AuthenticationResponse':
          authenticationResponse(json);
          break;
      }
    }

    setConnection(connection);
  }

  function authenticationTokenRequest() {
    const value = {
      apiName: "VTubeStudioPublicAPI",
      apiVersion: "1.0",
      requestID: process.env.NEXT_PUBLIC_REQUEST_ID,
      messageType: "AuthenticationTokenRequest",
      data: {
        pluginName: process.env.NEXT_PUBLIC_PLUGIN_NAME,
        pluginDeveloper: process.env.NEXT_PUBLIC_PLUGIN_DEVELOPER,
        pluginIcon: process.env.NEXT_PUBLIC_PLUGIN_ICON
      }
    } as Request;
    console.log(`connection: ${connection}`)
    connection?.send(JSON.stringify(value));
    console.log(JSON.stringify(value));
  }

  function authenticationTokenResponse(json: Response & { messageType: 'AuthenticationTokenResponse' }) {
    if (!json.data.authenticationToken) return;

    setAuthenticationToken(json.data.authenticationToken);
    setCookie(null, 'authenticationToken', json.data.authenticationToken);
    console.log('AuthenticationTokenResponse');
  }

  function authenticationRequest() {
    connection?.send(JSON.stringify({
      apiName: "VTubeStudioPublicAPI",
      apiVersion: "1.0",
      requestID: process.env.NEXT_PUBLIC_REQUEST_ID,
      messageType: "AuthenticationRequest",
      data: {
        pluginName: process.env.NEXT_PUBLIC_PLUGIN_NAME,
        pluginDeveloper: process.env.NEXT_PUBLIC_PLUGIN_DEVELOPER,
        authenticationToken: authenticationToken
      }
    } as Request));
    console.log('AuthenticationRequest');
  }

  function authenticationResponse(json: Response & { messageType: 'AuthenticationResponse' }) {
    setAuthenticated(json.data.authenticated);
    console.log('AuthenticationResponse');
  }

  function expressionActivationRequest(expressionFile: string, active: boolean) {
    connection?.send(JSON.stringify({
      apiName: 'VTubeStudioPublicAPI',
      apiVersion: '1.0',
      requestID: process.env.NEXT_PUBLIC_REQUEST_ID,
      messageType: 'ExpressionActivationRequest',
      data: {
        expressionFile: expressionFile,
        active: active
      }
    } as Request));
  }

  return (
    <main className={classNames("flex", "min-h-screen", "flex-col", "items-center", "p-24")}>
      <div className={classNames("z-10", "w-full", "max-w-5xl", "items-center", "justify-between", "font-mono", "text-sm", "lg:flex")}>
        <p className={classNames("fixed", "left-0", "top-0", "flex", "w-full", "justify-center", "border-b", "border-gray-300", "bg-gradient-to-b", "from-zinc-200", "pb-6", "pt-8", "backdrop-blur-2xl", "dark:border-neutral-800", "dark:bg-zinc-800/30", "dark:from-inherit", "lg:static", "lg:w-auto", "lg:rounded-xl", "lg:border", "lg:bg-gray-200 lg:p-4", "lg:dark:bg-zinc-800/30", "text-3xl", "font-extrabold", "dark:text-white")}>
          {process.env.NEXT_PUBLIC_PLUGIN_NAME}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <section className={classNames("p-12")}>
        <div className="mb-6">
          <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
          <div className="grid gap-6 mb-6 md:grid-cols-4">
            <input type="url" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-3" placeholder="ws://localhost:8001" required value={serverAddress} onChange={(event) => {
              setServerAddress(event.target.value);
            }} />
            <button className={classNames("text-white", "bg-blue-700", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "font-medium", "rounded-lg", "text-sm", "w-full", "sm:w-auto", "px-5", "py-2.5", "text-center", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")} onClick={(event) => {
              connectServer();
            }} disabled={connectedServer}>
              {connectedServer ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="auth_token" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Authentication Token</label>
          <div className="grid gap-6 mb-6 md:grid-cols-4">
            <input type="text" id="auth_token" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 col-span-3" placeholder="" required value={authenticationToken} onChange={(event) => {
              setAuthenticationToken(event.target.value);
            }} />
            <button className={classNames("text-white", "bg-blue-700", "hover:bg-blue-800", "focus:ring-4", "focus:outline-none", "focus:ring-blue-300", "font-medium", "rounded-lg", "text-sm", "w-full", "sm:w-auto", "px-5", "py-2.5", "text-center", "dark:bg-blue-600", "dark:hover:bg-blue-700", "dark:focus:ring-blue-800")} onClick={(event) => {
              authenticationTokenRequest();
            }}>Request</button>
          </div>
        </div>

        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={authenticationRequest} disabled={authenticated}>Authentication Request</button>
      </section>

      <section className={classNames("p-12")} >
        <div className="p-1">
          <h6 className="text-lg font-bold dark:text-white">フード</h6>
          <div className="inline-flex rounded-md shadow-sm gridç" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('フード0.5.exp3.json', false);
              expressionActivationRequest('フード1.exp3.json', false);
              expressionActivationRequest('フード0.exp3.json', true);
            }}>0</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('フード0.exp3.json', false);
              expressionActivationRequest('フード1.exp3.json', false);
              expressionActivationRequest('フード0.5.exp3.json', true);
            }}>0.5</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('フード0.exp3.json', false);
              expressionActivationRequest('フード0.5.exp3.json', false);
              expressionActivationRequest('フード1.exp3.json', true);
            }}>1</button>
          </div>
        </div>

        <div className="p-1">
          <h6 className="text-lg font-bold dark:text-white grid md:grid-cols-3">照れ</h6>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('照れ0.exp3.json', false);
              expressionActivationRequest('照れ1.exp3.json', false);
              expressionActivationRequest('照れ-1.exp3.json', true);
            }}>-1</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('照れ-1.exp3.json', false);
              expressionActivationRequest('照れ1.exp3.json', false);
              expressionActivationRequest('照れ0.exp3.json', true);
            }}>0</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('照れ-1.exp3.json', false);
              expressionActivationRequest('照れ0.exp3.json', false);
              expressionActivationRequest('照れ1.exp3.json', true);
            }}>1</button>
          </div>
        </div>

        <div className="p-1">
          <h6 className="text-lg font-bold dark:text-white grid md:grid-cols-2">顔の影</h6>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('顔の影1.exp3.json', false);
              expressionActivationRequest('顔の影0.exp3.json', true);
            }}>0</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('顔の影0.exp3.json', false);
              expressionActivationRequest('顔の影1.exp3.json', true);
            }}>1</button>
          </div>
        </div>

        <div className="p-1">
          <h6 className="text-lg font-bold dark:text-white grid md:grid-cols-2">涙</h6>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('涙1.exp3.json', false);
              expressionActivationRequest('涙0.exp3.json', true);
            }}>0</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('涙0.exp3.json', false);
              expressionActivationRequest('涙1.exp3.json', true);
            }}>1</button>
          </div>
        </div>

        <div className="p-1">
          <h6 className="text-lg font-bold dark:text-white grid md:grid-cols-2">瞳のハイライト</h6>
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('瞳のハイライト1.exp3.json', false);
              expressionActivationRequest('瞳のハイライト0.exp3.json', true);
            }}>0</button>
            <button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white col-span-1" onClick={() => {
              expressionActivationRequest('瞳のハイライト0.exp3.json', false);
              expressionActivationRequest('瞳のハイライト1.exp3.json', true);
            }}>1</button>
          </div>
        </div>
      </section>
    </main>
  );
}
