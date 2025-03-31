  import { HubConnectionBuilder } from '@microsoft/signalr';

  const signalRService = {
    connection: null,

    startConnection: async () => {
      signalRService.connection = new HubConnectionBuilder()
        .withUrl('http://your-api-url/hub') // Replace with your SignalR hub URL
        .withAutomaticReconnect()
        .build();

      try {
        await signalRService.connection.start();
        // console.log('SignalR connection established');
      } catch (error) {
        console.error('Error establishing SignalR connection: ', error);
      }
    },

    onReceiveMessage: (callback) => {
      if (signalRService.connection) {
        signalRService.connection.on('ReceiveMessage', callback); // Replace 'ReceiveMessage' with your method name
      }
    },

    sendMessage: async (message) => {
      if (signalRService.connection) {
        try {
          await signalRService.connection.invoke('SendMessage', message); // Replace 'SendMessage' with your method name
        } catch (error) {
          console.error('Error sending message: ', error);
        }
      }
    },

    stopConnection: async () => {
      if (signalRService.connection) {
        await signalRService.connection.stop();
        // console.log('SignalR connection stopped');
      }
    },
  };

  export default signalRService;