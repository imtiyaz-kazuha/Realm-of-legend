import React, { useState, useEffect } from 'react';
import LobbyMenu from './components/LobbyMenu';
import SplendorGame from './components/SplendorGame';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('Player 1');

  // Check URL query for direct room links: ?room=dragon-ball
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomName(roomParam);
      setInGame(true);
    }
  }, []);

  const handleStartLocal = (name) => {
    setPlayerName(name || 'Player 1');
    setRoomName('');
    setInGame(true);
  };

  const handleJoinRoom = (room, name) => {
    setPlayerName(name || 'Player 1');
    setRoomName(room);
    // Update URL without reload so user can share link
    const newUrl = `${window.location.pathname}?room=${room}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    setInGame(true);
  };

  const handleCreateRoom = (name) => {
    const randomId = 'room-' + Math.floor(1000 + Math.random() * 9000);
    handleJoinRoom(randomId, name);
  };

  const handleExitToLobby = () => {
    window.history.pushState({}, '', window.location.pathname);
    setInGame(false);
  };

  if (!inGame) {
    return (
      <LobbyMenu 
        onStartLocal={handleStartLocal}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
    );
  }

  return (
    <SplendorGame 
      roomName={roomName}
      playerOneName={playerName}
      onExitToLobby={handleExitToLobby}
    />
  );
}
