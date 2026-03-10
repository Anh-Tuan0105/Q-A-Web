import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketStore } from '../types/store';



const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketStore>((set, get) => ({
    socket: null,

    connect: () => {
        const accessToken = useAuthStore.getState().accessToken;
        const existingSocket = get().socket;

        if (existingSocket) return;

        const socket: Socket = io(SOCKET_URL, {
            auth: { token: accessToken },
            transports: ['websocket'],
        });

        set({ socket });

        socket.on("connect", () => {
            console.log("Socket connected");
        });
    },

    disconnect: () => {
        const socket = get().socket;
        if (socket) {
            socket.disconnect();
            set({ socket: null });
        }
    },

    joinRoom: (roomName: string) => {
        const { socket } = get();
        if (socket) {
            socket.emit("join_room", roomName);
        }
    },

    leaveRoom: (roomName: string) => {
        const { socket } = get();
        if (socket) {
            socket.emit("leave_room", roomName);
        }
    },

    on: (event: string, callback: (data: any) => void) => {
        const { socket } = get();
        if (socket) {
            socket.on(event, callback);
        } else {
            // Wait a bit or connect, but ideally depend on socket state in components
            get().connect();
            setTimeout(() => {
                get().socket?.on(event, callback);
            }, 100);
        }
    },

    off: (event: string, callback?: (data: any) => void) => {
        const { socket } = get();
        if (socket) {
            if (callback) {
                socket.off(event, callback);
            } else {
                socket.off(event);
            }
        }
    }
}));
