"use client"

import { useEffect } from 'react';

export default function wsTest() {

  useEffect(() => {
    // const socket = new WebSocket('ws://localhost:8765/');
    let socket = new WebSocket("ws://localhost:8080/");
    


    socket.onopen = function(event) {
      console.log('WebSocket connection opened:', event);
      let jsonData = JSON.stringify({test: "Hello, Secure Server!"});
      socket.send(jsonData);
    };

    socket.onmessage = function(event) {
      console.log('Data received from server:', event.data);
    };

    socket.onerror = function(error) {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = function(event) {
      if (event.wasClean) {
        console.log('WebSocket connection closed cleanly:', event);
      } else {
        console.error('Connection died');
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Client with Next.js</h1>
      {/* You can add more content and components here */}
    </div>
  );
}
