import { io } from "socket.io-client";

const baseURL = "http://localhost:"
const port = 3000;

// using main namespace
const socket = io(`${baseURL} + ${port}`)

// each new connection is assigned a random 20-char identifier
// The identifier is synced with the value on the server-side
socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
})

/**
 * Notes on ID
 * 
 * 1. The id will regenerated after each reconnection
 *    i. when the websocket connection is severed
 *   ii. when the user refreshes the page
 * 2. Two different browser tabs will have two different IDs
 */

socket.on("disconnect", () => {
  console.log(socket.id); // undefined
})