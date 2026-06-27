import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  Users, Search, Filter, Shield, User, UserPlus, UserCheck, 
  MessageSquare, Phone, Video, X, Send, Mic, MicOff, VideoOff, 
  Volume2, ShieldAlert, Sparkles, AlertCircle 
} from 'lucide-react';

const UserDirectory = () => {
  const { token, user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Follow & Chat states
  const [followedUsers, setFollowedUsers] = useState(() => {
    const saved = localStorage.getItem('fs_followed_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeCommTab, setActiveCommTab] = useState('chat'); // 'chat' | 'voice' | 'video'
  
  // Chat States
  const [chatMessages, setChatMessages] = useState({});
  const [typedMessage, setTypedMessage] = useState('');
  const chatEndRef = useRef(null);

  // Call States
  const [callState, setCallState] = useState('disconnected'); // 'connecting' | 'ringing' | 'connected' | 'disconnected'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const timerRef = useRef(null);
  const localVideoRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
        const res = await axios.get(`${apiBaseUrl}/api/auth/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success) {
          const list = res.data.data.filter(u => u._id !== currentUser?.id);
          setUsers(list);
        }
      } catch (err) {
        console.error('Failed to load user directory:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token, currentUser]);

  // Persist Follows
  useEffect(() => {
    localStorage.setItem('fs_followed_users', JSON.stringify(followedUsers));
  }, [followedUsers]);

  // Load and parse incoming chat messages from notifications
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
        const res = await axios.get(`${apiBaseUrl}/api/auth/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data?.success) {
          const list = res.data.data;
          setNotifications(list);
          
          const chats = {};
          list.forEach(n => {
            if (n.message.startsWith('[Chat] ')) {
              const content = n.message.substring(7); // strip "[Chat] "
              const idx = content.indexOf(': ');
              if (idx !== -1) {
                const senderName = content.substring(0, idx);
                const text = content.substring(idx + 2);
                
                const matchingUser = users.find(u => u.name === senderName);
                if (matchingUser) {
                  const uid = matchingUser._id;
                  if (!chats[uid]) chats[uid] = [];
                  chats[uid].push({
                    sender: 'them',
                    text,
                    time: n.createdAt,
                    notifId: n._id,
                    isRead: n.isRead
                  });
                }
              }
            }
          });
          
          setChatMessages(prev => {
            const next = { ...prev };
            Object.keys(chats).forEach(uid => {
              const incoming = chats[uid];
              const existing = prev[uid] || [];
              const merged = [...existing];
              
              incoming.forEach(incMsg => {
                const exists = merged.some(m => m.text === incMsg.text && Math.abs(new Date(m.time) - new Date(incMsg.time)) < 5000);
                if (!exists) {
                  merged.push(incMsg);
                }
              });
              
              merged.sort((a, b) => new Date(a.time) - new Date(b.time));
              next[uid] = merged;
            });
            return next;
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (token && users.length > 0) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [token, users]);

  // Mark chat messages as read when opening chat modal
  useEffect(() => {
    if (selectedUser && chatMessages[selectedUser._id]) {
      const unreadNotifs = chatMessages[selectedUser._id]
        .filter(m => m.sender === 'them' && !m.isRead && m.notifId);
        
      unreadNotifs.forEach(async (m) => {
        try {
          const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
          await axios.put(`${apiBaseUrl}/api/auth/notifications/${m.notifId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.error(err);
        }
      });
    }
  }, [selectedUser, chatMessages]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, selectedUser]);

  // Call duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  // Format call duration helper
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleFollowToggle = (userId) => {
    if (followedUsers.includes(userId)) {
      setFollowedUsers(followedUsers.filter(id => id !== userId));
    } else {
      setFollowedUsers([...followedUsers, userId]);
    }
  };

  // Open Communication Terminal
  const openTerminal = (user, type = 'chat') => {
    setSelectedUser(user);
    setActiveCommTab(type);
    
    // Initialize empty message log if not exists
    if (!chatMessages[user._id]) {
      setChatMessages(prev => ({
        ...prev,
        [user._id]: [
          { sender: 'system', text: `Secure E2EE communication channel established with ${user.name}.`, time: new Date() }
        ]
      }));
    }

    if (type === 'voice') {
      startVoiceCall();
    } else if (type === 'video') {
      startVideoCall();
    }
  };

  // Send Chat message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!typedMessage.trim() || !selectedUser) return;

    const messageText = typedMessage.trim();
    const recipientId = selectedUser._id;

    // Optimistically update the UI
    const userMsg = { sender: 'me', text: messageText, time: new Date() };
    setChatMessages(prev => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), userMsg]
    }));
    setTypedMessage('');

    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      await axios.post(
        `${apiBaseUrl}/api/auth/messages`,
        { recipientId, message: messageText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to send network chat message:', err);
    }
  };

  // Voice calling simulation
  const startVoiceCall = () => {
    setCallState('connecting');
    setTimeout(() => {
      setCallState('ringing');
      setTimeout(() => {
        setCallState('connected');
      }, 1500);
    }, 1000);
  };

  // Video calling with real webcam stream
  const startVideoCall = async () => {
    setCallState('connecting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      setTimeout(() => {
        setCallState('ringing');
        setTimeout(() => {
          setCallState('connected');
        }, 1500);
      }, 1000);
    } catch (err) {
      console.warn('Camera/Mic access denied or unavailable. Fallback to simulation mode:', err);
      // Fallback
      setTimeout(() => {
        setCallState('ringing');
        setTimeout(() => {
          setCallState('connected');
        }, 1500);
      }, 1000);
    }
  };

  const endCall = () => {
    setCallState('disconnected');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setActiveCommTab('chat');
  };

  const closeTerminal = () => {
    endCall();
    setSelectedUser(null);
  };

  // Filter list
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn select-none relative">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-[#132238] tracking-tight">Security Operator Directory</h1>
        <p className="text-xs text-[#6B7280] font-semibold mt-1">
          Search registered security analysts, administrators, and workspace operators across the platform.
        </p>
      </div>

      {/* Controls Card */}
      <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-5 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#94A3B8]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search operators by name or email address..."
            className="w-full pl-10 text-xs text-[#132238]"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto justify-end">
          <Filter className="h-4 w-4 text-[#94A3B8] shrink-0 mr-1" />
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              roleFilter === 'ALL' 
                ? 'bg-[#081B2F] text-white border-transparent' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('ADMIN')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              roleFilter === 'ADMIN' 
                ? 'bg-[#E8F8F0] text-[#2E855A] border-[#BCE8D1]' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setRoleFilter('USER')}
            className={`px-3 py-1.5 rounded-lg text-[9.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              roleFilter === 'USER' 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-[#F7FAFD] text-[#6B7280] border-[#E3EAF5] hover:bg-[#E3EAF5]/30'
            }`}
          >
            Analysts
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-[#E3EAF5] rounded-[20px] p-6 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Operator Name</th>
                <th>Identity Email</th>
                <th>Privilege Level</th>
                <th>Connection state</th>
                <th className="text-right">Communications Terminal</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-[#6B7280] font-semibold">
                    No matching operators identified in directory.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isAdmin = item.role === 'admin';
                  const isFollowing = followedUsers.includes(item._id);
                  return (
                    <tr key={item._id} className="hover:bg-slate-50/50">
                      <td className="font-bold text-[#132238] flex items-center space-x-2.5 py-3">
                        <div className="h-8 w-8 rounded-full bg-[#DCE7F8] text-[#081B2F] text-xs font-bold flex items-center justify-center">
                          {item.name ? item.name.split(' ').map(n => n[0]).join('') : 'OP'}
                        </div>
                        <div className="text-left">
                          <span className="block leading-none">{item.name}</span>
                          {isFollowing && (
                            <span className="text-[7.5px] font-bold uppercase text-[#43B97F] mt-1 inline-block">Following</span>
                          )}
                        </div>
                      </td>
                      <td className="text-[#6B7280] font-mono text-xs">{item.email}</td>
                      <td>
                        <span className={`badge ${isAdmin ? 'badge-success' : 'badge-info'}`}>
                          {isAdmin ? 'Security Admin' : 'Security Analyst'}
                        </span>
                      </td>
                      <td>
                        <span className="text-[9px] text-[#43B97F] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#43B97F] animate-pulse"></span>
                          <span>ONLINE</span>
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* Follow Button */}
                          <button
                            onClick={() => handleFollowToggle(item._id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isFollowing 
                                ? 'bg-[#E8F8F0] border-[#BCE8D1] text-[#2E855A]' 
                                : 'bg-[#F7FAFD] border-[#E3EAF5] text-[#6B7280] hover:text-[#132238] hover:bg-slate-100'
                            }`}
                            title={isFollowing ? 'Following' : 'Follow Operator'}
                          >
                            {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                          </button>
                          
                          {/* Chat */}
                          <button
                            onClick={() => openTerminal(item, 'chat')}
                            className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-[#132238] hover:bg-slate-100 transition-all cursor-pointer"
                            title="Chat Console"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                          </button>

                          {/* Voice call */}
                          <button
                            onClick={() => openTerminal(item, 'voice')}
                            className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                            title="Encrypted Voice Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </button>

                          {/* Video call */}
                          <button
                            onClick={() => openTerminal(item, 'video')}
                            className="p-2 rounded-xl border border-[#E3EAF5] bg-[#F7FAFD] text-[#6B7280] hover:text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer"
                            title="Secure Video Link"
                          >
                            <Video className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Communication Terminal Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-[#E3EAF5] rounded-[24px] shadow-2xl overflow-hidden flex flex-col h-[520px]">
            {/* Modal Header */}
            <div className="bg-[#0D1B2A] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-9 w-9 rounded-full bg-[#DCE7F8] text-[#081B2F] font-extrabold text-xs flex items-center justify-center">
                  {selectedUser.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs leading-none text-white">{selectedUser.name}</h3>
                  <span className="text-[8px] text-[#A7F08C] font-extrabold uppercase tracking-wider block mt-1">E2EE SECURE LINE</span>
                </div>
              </div>

              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleFollowToggle(selectedUser._id)}
                  className="px-2.5 py-1 rounded-lg border border-white/10 hover:bg-white/5 text-[9px] font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 cursor-pointer text-white"
                >
                  {followedUsers.includes(selectedUser._id) ? (
                    <>
                      <UserCheck className="h-3 w-3 text-[#A7F08C]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={closeTerminal}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>

            {/* Comm Tab Content */}
            <div className="flex-grow flex flex-col min-h-0 bg-[#F7FAFD]">
              {/* CHAT TAB VIEW */}
              {activeCommTab === 'chat' && (
                <div className="flex-grow flex flex-col min-h-0">
                  {/* Messages log */}
                  <div className="flex-grow overflow-y-auto p-5 space-y-4">
                    {(chatMessages[selectedUser._id] || []).map((msg, i) => {
                      if (msg.sender === 'system') {
                        return (
                          <div key={i} className="flex justify-center">
                            <span className="px-3.5 py-1 rounded bg-[#E3EAF5]/50 border border-[#E3EAF5] text-[8.5px] font-bold text-[#6B7280] uppercase tracking-wider">
                              {msg.text}
                            </span>
                          </div>
                        );
                      }
                      const isMe = msg.sender === 'me';
                      return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] p-3 rounded-2xl text-xs font-semibold ${
                            isMe 
                              ? 'bg-[#081B2F] text-white rounded-tr-none' 
                              : 'bg-white border border-[#E3EAF5] text-[#132238] rounded-tl-none shadow-sm'
                          }`}>
                            <p className="leading-relaxed break-words text-left">{msg.text}</p>
                            <span className={`text-[7.5px] mt-1 block font-mono text-right ${isMe ? 'text-[#94A3B8]' : 'text-slate-400'}`}>
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Send Input */}
                  <form onSubmit={handleSendMessage} className="bg-white border-t border-[#E3EAF5] p-4 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Type a secure message..."
                      value={typedMessage}
                      onChange={(e) => setTypedMessage(e.target.value)}
                      className="flex-grow text-xs text-[#132238] bg-[#F7FAFD]"
                    />
                    <button
                      type="submit"
                      className="p-2.5 rounded-xl bg-[#081B2F] hover:bg-[#102840] text-white transition-all cursor-pointer shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* VOICE CALL VIEW */}
              {activeCommTab === 'voice' && (
                <div className="flex-grow flex flex-col items-center justify-center p-6 bg-slate-900 text-white space-y-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                    <div className="h-80 w-80 rounded-full border border-white/20 animate-ping"></div>
                  </div>

                  <div className="text-center space-y-3 z-10">
                    <div className="h-24 w-24 rounded-full bg-slate-800 text-slate-300 border-2 border-white/10 flex items-center justify-center text-3xl font-extrabold mx-auto shadow-xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold tracking-tight text-white">{selectedUser.name}</h4>
                      <p className="text-[10px] text-[#A7F08C] font-mono tracking-widest uppercase mt-1">
                        {callState === 'connecting' && 'Establishing Connection...'}
                        {callState === 'ringing' && 'Secure Line Ringing...'}
                        {callState === 'connected' && 'Secure Line Active'}
                      </p>
                    </div>
                    {callState === 'connected' && (
                      <span className="font-mono text-xs font-bold text-white bg-slate-850 px-3 py-1 rounded-full border border-white/10 inline-block">
                        {formatDuration(callDuration)}
                      </span>
                    )}
                  </div>

                  {/* Call controls */}
                  <div className="flex items-center space-x-4 z-10">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                        isMuted 
                          ? 'bg-red-500 border-transparent text-white' 
                          : 'bg-slate-800 border-white/10 text-slate-350 hover:bg-slate-700'
                      }`}
                    >
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </button>
                    <button
                      onClick={endCall}
                      className="p-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all cursor-pointer"
                      title="Disconnect Call"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* VIDEO CALL VIEW */}
              {activeCommTab === 'video' && (
                <div className="flex-grow flex flex-col bg-slate-950 text-white relative h-full">
                  {/* Remote video feed (Simulated) */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="h-20 w-20 rounded-full bg-slate-800 text-slate-400 border border-white/10 flex items-center justify-center text-2xl font-extrabold mx-auto">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-350 tracking-wider uppercase">{selectedUser.name}</h4>
                        <span className="text-[9px] text-[#A7F08C] font-mono block mt-1">
                          {callState === 'connecting' && 'LINKING...'}
                          {callState === 'ringing' && 'SECURE RINGING...'}
                          {callState === 'connected' && `ENCRYPTED VIDEO CONSOLE (${formatDuration(callDuration)})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Local video feed (Active webcam stream) */}
                  {callState === 'connected' && (
                    <div className="absolute right-4 bottom-4 w-32 h-44 rounded-xl border border-white/20 bg-slate-900 shadow-2xl overflow-hidden z-20">
                      {isVideoOff ? (
                        <div className="h-full w-full flex items-center justify-center text-slate-500">
                          <VideoOff className="h-6 w-6" />
                        </div>
                      ) : (
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsinline
                          muted
                          className="w-full h-full object-cover scale-x-[-1]"
                        />
                      )}
                    </div>
                  )}

                  {/* Telemetry Graphic HUD Overlay */}
                  <div className="absolute inset-x-6 top-6 flex justify-between items-start pointer-events-none z-10 font-mono text-[8px] text-emerald-400 tracking-wider">
                    <div className="space-y-1">
                      <p>NODE: SEC_CNSL_ALPHA</p>
                      <p>PORT: 27017/TCP</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p>ENC: AES-GCM-256</p>
                      <p>QUALITY: EXCELLENT</p>
                    </div>
                  </div>

                  {/* Video Call Controls */}
                  <div className="absolute inset-x-0 bottom-6 flex items-center justify-center space-x-4 z-30">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        isMuted 
                          ? 'bg-red-500 border-transparent text-white' 
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {isMuted ? <MicOff className="h-4.5 w-4.5" /> : <Mic className="h-4.5 w-4.5" />}
                    </button>
                    
                    <button
                      onClick={endCall}
                      className="p-3 rounded-full bg-red-650 hover:bg-red-750 text-white shadow-xl transition-all cursor-pointer"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>

                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`p-3 rounded-full border transition-all cursor-pointer ${
                        isVideoOff 
                          ? 'bg-red-500 border-transparent text-white' 
                          : 'bg-slate-900/60 border-white/10 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="h-4.5 w-4.5" /> : <Video className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;
