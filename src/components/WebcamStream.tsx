import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertTriangle } from 'lucide-react';
import './WebcamStream.css';

interface WebcamStreamProps {
  id: string;
  name: string;
  isMock?: boolean;
}

const WebcamStream: React.FC<WebcamStreamProps> = ({ id, name, isMock = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const initCamera = async () => {
      try {
        if (!isMock) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720, facingMode: 'environment' } 
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }
      } catch (err) {
        setError('Camera access denied or unavailable.');
        console.error("Camera error:", err);
      }
    };

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isMock]);

  return (
    <div className="stream-container">
      <div className="scanline absolute inset-0 z-10 pointer-events-none"></div>
      
      {error ? (
        <div className="stream-error">
          <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
          <span>{error}</span>
        </div>
      ) : isMock ? (
        <div className="stream-mock">
          <div className="stream-mock-bg"></div>
          <div className="stream-mock-badge">
            <Camera className="w-3 h-3" /> CONNECTING STREAM...
          </div>
        </div>
      ) : (
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="stream-video"
        ></video>
      )}

      {/* Overlay UI */}
      <div className="stream-overlay-bottom">
        <span className="stream-name">{name}</span>
        <span className="stream-live-badge">
          <span className="pulse-dot"></span>
          LIVE
        </span>
      </div>
      
      <div className="stream-id-badge">{id}</div>

      {/* Simulate Geofence Tripwire Box (Mock) */}
      <div className="tripwire-zone">
        <div className="tripwire-label">Tripwire Zone Active</div>
      </div>
    </div>
  );
};

export default WebcamStream;
