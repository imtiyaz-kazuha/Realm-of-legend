import React, { useState, useEffect } from 'react';
import LobbyMenu from './components/LobbyMenu';
import SplendorGame from './components/SplendorGame';

export default function App() {
  const [inGame, setInGame] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [playerName, setPlayerName] = useState('Player 1');
  const [isAiMode, setIsAiMode] = useState(false);

  // Sync state with URL hash: #/home, #/ai, #/local, #/room/<roomName>
  useEffect(() => {
    const parseHashRoute = () => {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const queryRoom = searchParams.get('room');

      if (hash.startsWith('#/room/')) {
        const rName = hash.replace('#/room/', '').trim();
        if (rName) {
          setRoomName(rName);
          setIsAiMode(false);
          setInGame(true);
          return;
        }
      } else if (hash.startsWith('#/ai')) {
        setRoomName('');
        setIsAiMode(true);
        setInGame(true);
        return;
      } else if (hash.startsWith('#/local')) {
        setRoomName('');
        setIsAiMode(false);
        setInGame(true);
        return;
      } else if (queryRoom) {
        // Backward compatibility with ?room=
        setRoomName(queryRoom);
        setIsAiMode(false);
        setInGame(true);
        window.location.hash = `#/room/${queryRoom}`;
        return;
      } else {
        // Default to #/home
        setInGame(false);
        setIsAiMode(false);
        setRoomName('');
        if (!hash || hash === '#' || hash === '#/') {
          window.location.hash = '#/home';
        }
      }
    };

    parseHashRoute();
    window.addEventListener('hashchange', parseHashRoute);
    return () => window.removeEventListener('hashchange', parseHashRoute);
  }, []);

  const handleStartLocal = (name) => {
    setPlayerName(name || 'Player 1');
    setRoomName('');
    setIsAiMode(false);
    setInGame(true);
    window.location.hash = '#/local';
  };

  const handleStartAi = (name) => {
    setPlayerName(name || 'Player 1');
    setRoomName('');
    setIsAiMode(true);
    setInGame(true);
    window.location.hash = '#/ai';
  };

  const handleJoinRoom = (room, name) => {
    setPlayerName(name || 'Player 1');
    setRoomName(room);
    setIsAiMode(false);
    setInGame(true);
    window.location.hash = `#/room/${room}`;
  };

  const handleCreateRoom = (name) => {
    const randomId = 'room-' + Math.floor(1000 + Math.random() * 9000);
    handleJoinRoom(randomId, name);
  };

  const handleExitToLobby = () => {
    setIsAiMode(false);
    setInGame(false);
    window.location.hash = '#/home';
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
