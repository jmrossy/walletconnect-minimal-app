import WalletConnectClient, { CLIENT_EVENTS } from "@walletconnect/client";

console.log("hello world!");

let client

async function init() {
  client = await WalletConnectClient.init({
    controller: true,
    relayProvider: "wss://relay.walletconnect.org",
    metadata: {
      name: "Test Wallet",
      description: "Test Wallet",
      url: "#",
      icons: ["https://walletconnect.org/walletconnect-logo.png"],
    },
  });

  client.on(
    CLIENT_EVENTS.session.proposal,
    async (proposal) => {
      // user should be prompted to approve the proposed session permissions displaying also dapp metadata
      const { proposer, permissions } = proposal;
      const { metadata } = proposer;
      let approved;
      handleSessionUserApproval(approved, proposal); // described in the step 4
    }
  );

  client.on(
    CLIENT_EVENTS.session.created,
    async (session) => {
      // session created succesfully
    }
  );

  client.on(
    CLIENT_EVENTS.session.request,
    async (requestEvent) => {
      // WalletConnect client can track multiple sessions
      // assert the topic from which application requested
      const { topic, request } = requestEvent;
      const session = await client.session.get(requestEvent.topic);
      // now you can display to the user for approval using the stored metadata
      const { metadata } = session.peer;
      // after user has either approved or not the request it should be formatted
      // as response with either the result or the error message
      let result;
      const response = approved
        ? {
            topic,
            response: {
              id: request.id,
              jsonrpc: "2.0",
              result,
            },
          }
        : {
            topic,
            response: {
              id: request.id,
              jsonrpc: "2.0",
              error: {
                code: -32000,
                message: "User rejected JSON-RPC request",
              },
            },
          };
      await client.respond(response);
    }
  );
}

init().then(() => console.log('done init')).catch((e)=>console.error(e))