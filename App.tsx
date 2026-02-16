
import React from 'react';
import MouseTrail from './components/MouseTrail';

const App: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#14C9A0]">
      {/* 
        The text elements have been removed as requested.
        The default position of the trail logic starts at the screen center.
      */}
      <MouseTrail />
    </div>
  );
};

export default App;
