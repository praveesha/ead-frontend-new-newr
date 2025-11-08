import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { Message, WebSocketMessage } from "../types/chat";
import { API_PATHS } from "../utils/apiPaths";

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private subscribers: Map<string, (message: Message) => void> = new Map();
  private connectionPromise: Promise<void> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    // Use SockJS for WebSocket connection
    const socket = new SockJS(API_PATHS.CHAT.ENDPOINT);

    this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {},
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("STOMP Debug:", str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("WebSocket connected:", frame);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.handleConnection();
      },
      onDisconnect: (frame) => {
        console.log("WebSocket disconnected:", frame);
        this.isConnected = false;
        this.handleDisconnection();
      },
      onStompError: (frame) => {
        console.error("STOMP Error:", frame.headers["message"], frame.body);
        this.handleError(frame);
      },
      onWebSocketError: (error) => {
        console.error("WebSocket Error:", error);
        this.handleReconnection();
      },
      onWebSocketClose: (event) => {
        console.log("WebSocket closed:", event);
        this.isConnected = false;
        this.handleReconnection();
      },
    });
  }

  private handleConnection() {
    // Re-subscribe to all active subscriptions after reconnection
    const subscriptions = Array.from(this.subscribers.keys());
    subscriptions.forEach((chatId) => {
      this.subscribeToChat(parseInt(chatId), this.subscribers.get(chatId)!);
    });
  }

  private handleDisconnection() {
    // Clean up any connection-dependent state
    this.isConnected = false;
  }

  private handleError(frame: {
    headers: Record<string, string>;
    body: string;
  }) {
    console.error("WebSocket STOMP error:", frame);
    // Handle specific error types if needed
  }

  private handleReconnection() {
    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      !this.isConnected
    ) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      console.log(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        if (!this.isConnected) {
          this.connect();
        }
      }, delay);
    }
  }

  // Public methods
  async connect(authToken?: string): Promise<void> {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      // Add authorization header if token is provided
      if (authToken) {
        this.client!.connectHeaders = {
          Authorization: `Bearer ${authToken}`,
        };
      }

      // Set up one-time handlers for connection result
      const originalOnConnect = this.client!.onConnect;
      const originalOnStompError = this.client!.onStompError;

      this.client!.onConnect = (frame) => {
        originalOnConnect(frame);
        this.connectionPromise = null;
        resolve();
      };

      this.client!.onStompError = (frame) => {
        originalOnStompError(frame);
        this.connectionPromise = null;
        reject(new Error(`Connection failed: ${frame.headers["message"]}`));
      };

      // Start connection
      this.client!.activate();
    });

    return this.connectionPromise;
  }

  disconnect() {
    if (this.client && this.isConnected) {
      this.client.deactivate();
      this.isConnected = false;
      this.subscribers.clear();
      this.connectionPromise = null;
      this.reconnectAttempts = 0;
    }
  }

  subscribeToChat(
    chatId: number,
    onMessage: (message: Message) => void
  ): () => void {
    if (!this.client) {
      throw new Error("WebSocket client not initialized");
    }

    const destination = `/topic/chat/${chatId}`;
    const subscriberKey = chatId.toString();

    // Store subscriber for reconnection handling
    this.subscribers.set(subscriberKey, onMessage);

    if (!this.isConnected) {
      console.warn(
        "WebSocket not connected. Subscription will be activated on connection."
      );
      return () => this.subscribers.delete(subscriberKey);
    }

    const subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const webSocketMessage: WebSocketMessage = JSON.parse(message.body);
          onMessage(webSocketMessage.payload);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      }
    );

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
      this.subscribers.delete(subscriberKey);
    };
  }

  sendMessage(messageData: Record<string, unknown>) {
    if (!this.client || !this.isConnected) {
      throw new Error("WebSocket not connected");
    }

    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(messageData),
    });
  }

  // Utility methods
  isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  getConnectionState():
    | "connected"
    | "disconnected"
    | "connecting"
    | "reconnecting" {
    if (this.connectionPromise) return "connecting";
    if (this.isConnected) return "connected";
    if (this.reconnectAttempts > 0) return "reconnecting";
    return "disconnected";
  }

  // Reset connection state (useful for testing)
  reset() {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connectionPromise = null;
    this.initializeClient();
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
