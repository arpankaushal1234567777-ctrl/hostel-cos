"use client";

import { useEffect, useState } from "react";
import { Building2, Bed, DoorOpen, Users, Loader2, ChevronLeft, Wrench, CheckCircle2 } from "lucide-react";

interface BedInfo {
  _id: string;
  bedIdentifier: string;
  status: string;
}

interface Room {
  _id: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  currentOccupancy: number;
  status: string;
  beds: BedInfo[];
}

interface Hostel {
  _id: string;
  name: string;
  genderAllowed: string;
  studentType: string;
  totalRooms: number;
  totalCapacity: number;
  occupiedBeds: number;
  availableBeds: number;
  occupancyPercentage: number;
}

export function HostelsTab() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchHostels = async () => {
    try {
      const res = await fetch("/api/admin/hostels");
      if (res.ok) {
        const data = await res.json();
        setHostels(data.hostels);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingHostels(false);
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  const handleHostelSelect = async (hostel: Hostel) => {
    setSelectedHostel(hostel);
    setLoadingRooms(true);
    try {
      const res = await fetch(`/api/admin/hostels/${hostel._id}/rooms`);
      if (res.ok) {
        const data = await res.json();
        setRooms(data.rooms);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleBackToHostels = () => {
    setSelectedHostel(null);
    setRooms([]);
    fetchHostels(); // Refresh stats when going back
  };

  const handleRoomStatusToggle = async (roomId: string, currentStatus: string) => {
    const newStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
    setActionLoading(`room-${roomId}`);
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRooms((prev) => prev.map((r) => r._id === roomId ? { ...r, status: newStatus } : r));
        if (selectedRoom?._id === roomId) {
          setSelectedRoom((prev) => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBedStatusToggle = async (roomId: string, bedId: string, currentStatus: string) => {
    const newStatus = currentStatus === "MAINTENANCE" ? "AVAILABLE" : "MAINTENANCE";
    setActionLoading(`bed-${bedId}`);
    try {
      const res = await fetch(`/api/admin/rooms/${roomId}/beds/${bedId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRooms((prev) => prev.map((r) => {
          if (r._id === roomId) {
            return {
              ...r,
              beds: r.beds.map((b) => b._id === bedId ? { ...b, status: newStatus } : b)
            };
          }
          return r;
        }));
        if (selectedRoom?._id === roomId) {
          setSelectedRoom((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              beds: prev.beds.map((b) => b._id === bedId ? { ...b, status: newStatus } : b)
            };
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "AVAILABLE": return "bg-green-500";
      case "OCCUPIED": return "bg-blue-500";
      case "RESERVED": return "bg-amber-500";
      case "MAINTENANCE": return "bg-red-500";
      default: return "bg-neutral-500";
    }
  };

  if (loadingHostels) {
    return (
      <div className="flex justify-center py-20 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // --- ROOMS VIEW ---
  if (selectedHostel) {
    return (
      <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBackToHostels}
              className="p-2 -ml-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{selectedHostel.name}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> {selectedHostel.occupiedBeds} / {selectedHostel.totalCapacity} Beds Occupied
              </p>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {loadingRooms ? (
          <div className="flex justify-center py-20 w-full">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {rooms.map((room) => {
              const availableBeds = room.beds.filter(b => b.status === "AVAILABLE").length;
              return (
                <div 
                  key={room._id} 
                  onClick={() => setSelectedRoom(room)}
                  className={`card-apple p-4 flex flex-col gap-3 cursor-pointer hover:border-foreground/20 transition-all ${room.status === "MAINTENANCE" ? "opacity-60 grayscale hover:grayscale-0" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-mono font-medium text-lg">{room.roomNumber}</div>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${getStatusColor(room.status)}`} title={`Room Status: ${room.status}`} />
                  </div>
                  <div className="text-xs text-muted-foreground">{room.roomType}</div>
                  <div className="flex justify-between items-end mt-2 pt-2 border-t border-border/50">
                    <div className="text-xs font-medium">
                      {room.currentOccupancy}/{room.capacity}
                    </div>
                    <div className="text-[10px] text-green-600 dark:text-green-400 font-medium">
                      {availableBeds} Avail
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="card-apple bg-background w-full max-w-lg overflow-hidden shadow-2xl border-border/60 animate-in zoom-in-95 duration-200">
              
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center border border-indigo-500/20">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">Room {selectedRoom.roomNumber}</h3>
                    <p className="text-xs text-muted-foreground">{selectedRoom.roomType}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedRoom(null)} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Room Level Status */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                  <div>
                    <div className="text-sm font-medium">Room Status</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{selectedRoom.status}</div>
                  </div>
                  <button 
                    onClick={() => handleRoomStatusToggle(selectedRoom._id, selectedRoom.status)}
                    disabled={actionLoading === `room-${selectedRoom._id}`}
                    className={`p-2 rounded-lg transition-colors border ${
                      selectedRoom.status === "MAINTENANCE" 
                        ? "bg-green-500/10 border-green-500/20 text-green-600 hover:bg-green-500/20" 
                        : "bg-red-500/10 border-red-500/20 text-red-600 hover:bg-red-500/20"
                    }`}
                    title={selectedRoom.status === "MAINTENANCE" ? "Mark Available" : "Mark Maintenance"}
                  >
                    {actionLoading === `room-${selectedRoom._id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     selectedRoom.status === "MAINTENANCE" ? <CheckCircle2 className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                  </button>
                </div>

                {/* Beds */}
                <div>
                  <h4 className="text-sm font-medium tracking-tight mb-3">Beds</h4>
                  <div className="space-y-3">
                    {selectedRoom.beds.map((bed) => (
                      <div key={bed._id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-sm font-medium border ${
                            bed.status === "AVAILABLE" ? "bg-green-500/10 border-green-500/20 text-green-600" :
                            bed.status === "OCCUPIED" ? "bg-blue-500/10 border-blue-500/20 text-blue-600" :
                            bed.status === "MAINTENANCE" ? "bg-red-500/10 border-red-500/20 text-red-600" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-600"
                          }`}>
                            {bed.bedIdentifier}
                          </div>
                          <span className="text-sm font-medium capitalize text-muted-foreground">{bed.status.toLowerCase()}</span>
                        </div>
                        
                        {(bed.status === "AVAILABLE" || bed.status === "MAINTENANCE") && (
                          <button 
                            onClick={() => handleBedStatusToggle(selectedRoom._id, bed._id, bed.status)}
                            disabled={actionLoading === `bed-${bed._id}`}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors p-2"
                          >
                            {actionLoading === `bed-${bed._id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                             bed.status === "MAINTENANCE" ? "Restore" : "Disable"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    );
  }

  // --- HOSTELS OVERVIEW ---
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">Hostels & Rooms</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage university capacity, room statuses, and bed availability.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {hostels.map((hostel) => (
          <div 
            key={hostel._id}
            onClick={() => handleHostelSelect(hostel)}
            className="card-apple p-6 sm:p-8 cursor-pointer hover:border-foreground/20 transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg tracking-tight text-foreground">{hostel.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{hostel.genderAllowed.toLowerCase()} • {hostel.studentType.toLowerCase()}</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="text-foreground">{hostel.occupancyPercentage}%</span>
                </div>
                <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${hostel.occupancyPercentage}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid Bottom */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/50">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider mb-1">Rooms</div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-indigo-500/70" /> {hostel.totalRooms}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider mb-1">Avail Beds</div>
                  <div className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1.5">
                    <Bed className="w-3.5 h-3.5" /> {hostel.availableBeds}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider mb-1">Total Cap</div>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500/70" /> {hostel.totalCapacity}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
