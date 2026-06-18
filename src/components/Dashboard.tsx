import React, { useState, useEffect } from 'react';
import { Shield, Settings, Users, LogOut, Video, PlusSquare, AlertOctagon, Download, ChevronLeft, CheckCircle2 } from 'lucide-react';
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
  ]);
  
  // Add Device Modal State
  const [showAddDVR, setShowAddDVR] = useState(false);
  const [addMode, setAddMode] = useState('InstaOn');
  const [serialNo, setSerialNo] = useState('');
  const [deviceName, setDeviceName] = useState('Home');
  const [username, setUsername] = useState('admin');
  const [dvrPassword, setDvrPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<'Offline' | 'Online'>('Offline');
  const [linkedChannels, setLinkedChannels] = useState([
    { id: '1', name: 'CAM 1', selected: true },
    { id: '2', name: 'CAM 2', selected: true },
    { id: '3', name: 'CAM 3', selected: true },
    { id: '4', name: 'CAM 4', selected: true },
  ]);

  // Mock AI Engine Alerts
  useEffect(() => {
    const threatTypes = ['Suspicious Person', 'Weapon Detected', 'Intrusion (Zone A)', 'Aggressive Behavior'];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.6 && cameras.length > 0) {
        const randomCam = cameras[Math.floor(Math.random() * cameras.length)];
        const newAlert: Alert = {
          id: Math.random().toString(36).substring(7),
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          camera: randomCam.id,
          time: new Date().toLocaleTimeString([], { hour12: false }),
          severity: Math.random() > 0.8 ? 'critical' : Math.random() > 0.5 ? 'high' : 'medium',
          confidence: Math.floor(Math.random() * 20 + 80)
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 50));
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [cameras]);

  const handleSimulateConnection = () => {
    if (serialNo.length > 5) {
      setIsConnecting(true);
      setTimeout(() => {
        setDeviceStatus('Online');
        setIsConnecting(false);
      }, 1000);
    }
  };

  const handleSaveDevice = () => {
    if (deviceStatus === 'Online') {
      const newCams = linkedChannels
        .filter(ch => ch.selected)
        .map(ch => ({
          id: `CAM-${Math.floor(Math.random()*1000)}`,
          name: `${deviceName} - ${ch.name}`,
          isMock: true
        }));
      setCameras([...cameras, ...newCams]);
      setShowAddDVR(false);
      
      // Reset state
      setDeviceStatus('Offline');
      setSerialNo('');
      setDeviceName('Home');
      setDvrPassword('');
    }
  };

  const toggleChannel = (id: string) => {
    setLinkedChannels(channels => 
      channels.map(ch => ch.id === id ? { ...ch, selected: !ch.selected } : ch)
    );
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
              <PlusSquare className="w-3.5 h-3.5" /> ADD DEVICE
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

      {/* Advanced Add Device Modal (iCMOB style) */}
      {showAddDVR && (
        <div className="modal-overlay">
          <div className="device-panel">
            <div className="device-header">
              <button onClick={() => setShowAddDVR(false)} className="device-back-btn">
                <ChevronLeft className="w-5 h-5 text-red-500" />
              </button>
              <h3 className="device-title">Home</h3>
              <button 
                onClick={handleSaveDevice}
                className={`device-save-btn ${deviceStatus === 'Online' ? 'active' : ''}`}
              >
                Save
              </button>
            </div>

            <div className="device-form">
              <div className="device-row">
                <span className="device-label">Add Mode</span>
                <select className="device-input select" value={addMode} onChange={e => setAddMode(e.target.value)}>
                  <option>InstaOn</option>
                  <option>IP/Domain</option>
                </select>
              </div>
              
              <div className="device-row">
                <span className="device-label">Device Status:</span>
                <span className={`device-status ${deviceStatus === 'Online' ? 'online' : 'offline'}`}>
                  {isConnecting ? 'Connecting...' : deviceStatus}
                </span>
              </div>

              <div className="device-row">
                <span className="device-label">SN:</span>
                <input 
                  type="text" 
                  className="device-input text-right"
                  placeholder="Enter Serial Number"
                  value={serialNo}
                  onChange={e => {
                    setSerialNo(e.target.value);
                    setDeviceStatus('Offline');
                  }}
                  onBlur={handleSimulateConnection}
                />
              </div>

              <div className="device-row">
                <span className="device-label">Name:</span>
                <input 
                  type="text" 
                  className="device-input text-right"
                  value={deviceName}
                  onChange={e => setDeviceName(e.target.value)}
                />
              </div>

              <div className="device-row">
                <span className="device-label">Username:</span>
                <input 
                  type="text" 
                  className="device-input text-right"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div className="device-row">
                <span className="device-label">Password:</span>
                <input 
                  type="password" 
                  className="device-input text-right"
                  placeholder="Required"
                  value={dvrPassword}
                  onChange={e => {
                    setDvrPassword(e.target.value);
                    setDeviceStatus('Offline');
                  }}
                  onBlur={handleSimulateConnection}
                />
              </div>

              <div className="device-row link">
                <span className="device-label text-gray-300">Modify Device Password</span>
              </div>

              <div className="device-channels-header">
                Linked Channel
              </div>
              
              <div className="device-channels-list">
                {linkedChannels.map(channel => (
                  <div 
                    key={channel.id} 
                    className="device-channel-row"
                    onClick={() => toggleChannel(channel.id)}
                  >
                    <div className={`channel-radio ${channel.selected ? 'selected' : ''}`}>
                      {channel.selected && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    </div>
                    <span className="channel-name">{channel.name}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
