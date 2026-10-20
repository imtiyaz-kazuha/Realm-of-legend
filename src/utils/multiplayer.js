import Peer from 'peerjs';

class MultiplayerSync {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.isHost = false;
    this.onConnected = null;
    this.onDataReceived = null;
    this.onDisconnected = null;
  }

  // Connect via room ID
  init(roomName, playerName, onConnected, onDataReceived, onDisconnected) {
    this.onConnected = onConnected;
    this.onDataReceived = onDataReceived;
    this.onDisconnected = onDisconnected;

    const sanitizedRoom = roomName.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    const hostPeerId = `rol-room-${sanitizedRoom}`;

    // First attempt to be the host of this room
    this.peer = new Peer(hostPeerId, {
      debug: 1,
    });

    this.peer.on('open', (id) => {
      this.isHost = true;
      console.log('Room created as Host:', id);
    });

    this.peer.on('connection', (conn) => {
      // Guest connected to us
      this.conn = conn;
      this.setupConnection(playerName);
    });

    this.peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        // Host already exists! We join as guest
        console.log('Host already exists in this room. Joining as guest...');
        this.peer.destroy();

        // Create a random guest peer and connect to the host
        this.peer = new Peer({ debug: 1 });
        this.peer.on('open', () => {
          this.isHost = false;
          this.conn = this.peer.connect(hostPeerId, {
            reliable: true,
            metadata: { playerName }
          });
          this.setupConnection(playerName);
        });
      } else {
        console.warn('P2P Peer error:', err);
      }
    });
  }

  setupConnection(myPlayerName) {
    if (!this.conn) return;

    this.conn.on('open', () => {
      console.log('P2P connection open!');
      if (this.onConnected) {
        this.onConnected({
          isHost: this.isHost,
          remoteName: this.conn.metadata?.playerName || (this.isHost ? 'Guest' : 'Host')
        });
      }

      // Handshake player name
      this.send({ type: 'HANDSHAKE', name: myPlayerName });
    });

    this.conn.on('data', (data) => {
      if (data?.type === 'HANDSHAKE') {
        if (this.onConnected) {
          this.onConnected({
            isHost: this.isHost,
            remoteName: data.name
          });
        }
      } else if (this.onDataReceived) {
        this.onDataReceived(data);
      }
    });

    this.conn.on('close', () => {
      if (this.onDisconnected) this.onDisconnected();
    });
  }

  send(data) {
    if (this.conn && this.conn.open) {
      this.conn.send(data);
    }
  }

  destroy() {
    if (this.conn) this.conn.close();
    if (this.peer) this.peer.destroy();
  }
}

export const p2p = new MultiplayerSync();
