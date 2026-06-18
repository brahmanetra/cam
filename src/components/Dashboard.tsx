import React, { useState, useEffect } from 'react';
import { Shield, Settings, Users, LogOut, Video, PlusSquare, AlertOctagon, Download } from 'lucide-react';
import WebcamStream from './WebcamStream';
import './Dashboard.css';

interface DashboardProps {
  onLogout: () => void;
}

interface Alert {
  id: string;
  type: string;
  camera: string;
  time: string;
  severity: 'critical' | 'high' | 'medium';
  confidence: number;
}

interface Camera {
  id: string;
  name: string;
  isMock: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([
    { id: 'CAM-01', name: 'Browser Live Cam', isMock: false },
    { id: 'CAM-02', name: 'DVR-Main-Ent', isMock: true },
    { id: 'CAM-03', name: 'DVR-Server-Rm', isMock: true },
    { id: 'CAM-04', name: 'DVR-Parking', isMock: true },
  ]);
  const [showAddDVR, setShowAddDVR] = useState(false);
  const [serialNo, setSerialNo] = useState('');
  const [dvrPassword, setDvrPassword] = useState('');

  // Mock AI Engine Alerts
  useEffect(() => {
    const threatTypes = ['Suspicious Person', 'Weapon Detected', 'Intrusion (Zone A)', 'Aggressive Behavior'];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const newAlert: Alert = {
          id: Math.random().toString(36).substring(7),
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          camera: `CAM-0${Math.floor(Math.random() * 4) + 1}`,
          time: new Date().toLocaleTimeString([], { hour12: false }),
          severity: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
          confidence: Math.floor(Math.random() * 20 + 80)
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 50));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddDVR = (e: React.FormEvent) => {
    e.preventDefault();
    const newCam = {
      id: `CAM-0${cameras.length + 1}`,
      name: `DVR-${serialNo.substring(0,4)}`,
      isMock: true
    };
    setCameras([...cameras, newCam]);
    setShowAddDVR(false);
    setSerialNo('');
    setDvrPassword('');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <Shield className="w-5 h-5 text-[var(--accent-primary)]" />
          <h1 className="header-title">
            MAHANETRA
            <span className="version-badge">V2.1.0</span>
          </h1>
        </div>
        
        <div className="header-right">
          <div className="status-indicator">
            <span className="pulse-dot"></span>
            {cameras.length} CAMERAS ONLINE
          </div>
          <div className="flex gap-4">
            <button className="icon-btn"><Settings className="w-4 h-4" /></button>
            <button className="icon-btn"><Users className="w-4 h-4" /></button>
            <button onClick={onLogout} className="icon-btn danger"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="dashboard-main">
        
        {/* Left Side: Camera Grid */}
        <div className="feed-section">
          
          <div className="section-header">
            <h2 className="section-title">
              <Video className="w-4 h-4" /> 
              LIVE FEEDS
            </h2>
            <button 
              onClick={() => setShowAddDVR(true)}
              className="action-btn"
            >
              <PlusSquare className="w-3.5 h-3.5" /> ADD DVR
            </button>
          </div>

          <div className="camera-grid">
            {cameras.map(cam => (
              <WebcamStream key={cam.id} id={cam.id} name={cam.name} isMock={cam.isMock} />
            ))}
          </div>

        </div>

        {/* Right Side: Alert Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2 className="section-title text-red-400">
              <AlertOctagon className="w-4 h-4" />
              THREAT TIMELINE
            </h2>
            <button className="icon-btn" title="Export Evidence PDF">
              <Download className="w-4 h-4" />
            </button>
          </div>
          
          <div className="alert-list">
            {alerts.length === 0 ? (
              <div className="empty-state">WAITING FOR DETECTIONS...</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className={`alert-item alert-enter severity-${alert.severity}`}>
                  <div className="alert-header">
                    <span className={`alert-type ${alert.severity}`}>
                      {alert.type}
                    </span>
                    <span className="alert-time">{alert.time}</span>
                  </div>
                  <div className="alert-footer">
                    <span className="alert-camera">{alert.camera}</span>
                    <span className="alert-conf">CONF: {alert.confidence}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </div>

      {/* Add DVR Modal */}
      {showAddDVR && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <h3 className="modal-title">
              <PlusSquare className="w-5 h-5" /> ADD DVR (iCMOB)
            </h3>
            <form onSubmit={handleAddDVR} className="login-form">
              <div className="input-group">
                <label className="input-label">Serial Number</label>
                <input 
                  type="text" 
                  required 
                  className="input-field"
                  placeholder="e.g. 4C0123456789"
                  value={serialNo}
                  onChange={e => setSerialNo(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Device Password</label>
                <input 
                  type="password" 
                  required 
                  className="input-field"
                  placeholder="Admin password"
                  value={dvrPassword}
                  onChange={e => setDvrPassword(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddDVR(false)} className="btn-secondary">CANCEL</button>
                <button type="submit" className="btn-primary flex-1">CONNECT</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
