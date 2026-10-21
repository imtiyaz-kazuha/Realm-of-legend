import React, { useState, useEffect } from 'react';
import LobbyMenu from './components/LobbyMenu';
import SplendorGame from './components/SplendorGame';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('Player 1');
  const [isAiMode, setIsAiMode] = useState(false);

  // Check URL query for direct room links: ?room=dragon-ball
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam) {
      setRoomName(roomParam);
      setIsAiMode(false);
      setInGame(true);
    }
  }, []);

  const handleStartLocal = (name) => {
    setPlayerName(name || 'Player 1');
    setRoomName('');
    setIsAiMode(false);
    setInGame(true);
  };

  const handleStartAi = (name) => {
    setPlayerName(name || 'Player 1');
    setRoomName('');
    setIsAiMode(true);
    setInGame(true);
  };

  const handleJoinRoom = (room, name) => {
    setPlayerName(name || 'Player 1');
    setRoomName(room);
    setIsAiMode(false);
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
    setIsAiMode(false);
    setInGame(false);
  };

  if (!inGame) {
    return (
      <LobbyMenu 
        onStartLocal={handleStartLocal}
        onStartAi={handleStartAi}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
    );
  }

  return (
    <SplendorGame 
      roomName={roomName}
      playerOneName={playerName}
      isAiMode={isAiMode}
      onExitToLobby={handleExitToLobby}
    />
  );
}
