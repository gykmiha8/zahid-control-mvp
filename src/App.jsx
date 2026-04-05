import React, { useState, useEffect } from 'react';

const generateId = () => Math.random().toString(36).substr(2, 9);

function TaskBoard({ tasks, setTasks }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setTasks([...tasks, { id: generateId(), title: newTaskTitle, status: newTaskStatus, isAutoTask: false, linkedAreaId: null }]);
    setNewTaskTitle('');
  };

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id && !t.isAutoTask ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(t => t.id !== id || t.isAutoTask));
    }
  };

  const columns = ['todo', 'in progress', 'done'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4 text-slate-800">Add Manual Task</h2>
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-4">
          <input 
            className="border border-slate-300 rounded-lg px-4 py-2.5 flex-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
            placeholder="Task Title..." 
            value={newTaskTitle} 
            onChange={e => setNewTaskTitle(e.target.value)} 
          />
          <select 
            className="border border-slate-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white cursor-pointer" 
            value={newTaskStatus} 
            onChange={e => setNewTaskStatus(e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
            Add Task
          </button>
        </form>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col} className="bg-slate-100/60 rounded-xl p-4 min-h-[500px] border border-slate-200 flex flex-col">
            <h3 className="font-bold text-slate-700 uppercase mb-4 text-sm flex items-center justify-between tracking-wide">
              {col}
              <span className="bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full text-xs font-bold shadow-inner">
                {tasks.filter(t => t.status === col).length}
              </span>
            </h3>
            <div className="space-y-4 flex-1">
              {tasks.filter(t => t.status === col).map(task => (
                <div key={task.id} className={`bg-white p-5 rounded-xl shadow-sm border-l-4 transition-all hover:shadow-md
                  ${task.isAutoTask ? 'border-red-500 shadow-red-100/50' : 'border-indigo-400'}`}>
                  
                  <p className="font-semibold text-slate-800 leading-snug">{task.title}</p>
                  
                  {task.isAutoTask && (
                    <span className="text-[10px] text-red-600 font-black uppercase tracking-wider mt-3 inline-block bg-red-50 px-2 py-1 rounded-md border border-red-100">
                      Auto Task
                    </span>
                  )}
                  
                  {!task.isAutoTask && (
                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <select 
                        value={task.status} 
                        onChange={(e) => moveTask(task.id, e.target.value)}
                        className="text-xs font-medium border border-slate-200 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500 bg-slate-50 cursor-pointer"
                      >
                         <option value="todo">Move to To Do</option>
                         <option value="in progress">Move to In Progress</option>
                         <option value="done">Move to Done</option>
                      </select>
                      <button onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status === col).length === 0 && (
                <div className="h-full flex items-center justify-center">
                  <span className="text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 px-6 py-4 rounded-lg">
                    Drop tasks here
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TicketControl({ tickets, setTickets, areas, setAreas }) {
  const [enterCode, setEnterCode] = useState('');
  const [newCode, setNewCode] = useState('');

  const handleEnter = (e) => {
    e.preventDefault();
    if (!enterCode.trim()) return;
    const ticketIndex = tickets.findIndex(t => t.code === enterCode);
    if (ticketIndex === -1) {
      alert("Ticket not found!");
      return;
    }
    if (tickets[ticketIndex].status !== 'valid') {
      alert(`Cannot enter. Ticket is ${tickets[ticketIndex].status}.`);
      return;
    }

    const newTickets = [...tickets];
    newTickets[ticketIndex].status = 'activated';
    setTickets(newTickets);

    setAreas(areas.map(a => a.id === 'entrance' ? { ...a, currentPeople: Number(a.currentPeople) + 1 } : a));
    setEnterCode('');
  };

  const handleExit = () => {
    const entrance = areas.find(a => a.id === 'entrance');
    if (entrance && entrance.currentPeople > 0) {
      setAreas(areas.map(a => a.id === 'entrance' ? { ...a, currentPeople: Number(a.currentPeople) - 1 } : a));
    } else {
      alert("Entrance area is already empty.");
    }
  };

  const addTicket = (e) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    if (tickets.some(t => t.code === newCode)) {
      alert("Ticket code already exists.");
      return;
    }
    setTickets([...tickets, { id: generateId(), code: newCode, status: 'valid' }]);
    setNewCode('');
  };

  const activateTicket = (id) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'activated' } : t));
    setAreas(areas.map(a => a.id === 'entrance' ? { ...a, currentPeople: Number(a.currentPeople) + 1 } : a));
  };

  const banTicket = (id) => {
    if (window.confirm("Are you sure you want to ban this ticket?")) {
      setTickets(tickets.map(t => t.id === id ? { ...t, status: 'banned' } : t));
    }
  };

  const deleteTicket = (id) => {
    if (window.confirm("Delete this ticket permanently?")) {
      setTickets(tickets.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Entrance Gate
          </h2>
          <form onSubmit={handleEnter} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input 
              className="border border-slate-300 rounded-lg px-4 py-3 flex-1 outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg shadow-inner bg-slate-50 focus:bg-white transition-colors" 
              placeholder="Scan Ticket Code" 
              value={enterCode} 
              onChange={e => setEnterCode(e.target.value)} 
            />
            <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg transform active:scale-95 whitespace-nowrap">
              Enter Festival
            </button>
          </form>
          <div className="border-t border-slate-100 pt-6">
            <button onClick={handleExit} className="w-full bg-slate-100 text-slate-700 border border-slate-200 px-4 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors flex justify-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              Exit Festival (-1 Person)
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg flex flex-col justify-center items-center relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-5"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-white opacity-5"></div>
          
          <h2 className="text-lg font-bold mb-2 text-slate-300 z-10 uppercase tracking-widest">Entrance Live Capacity</h2>
          <div className="text-7xl font-black tracking-tight z-10 flex items-baseline drop-shadow-md">
            {areas.find(a => a.id === 'entrance')?.currentPeople || 0}
            <span className="text-3xl text-slate-400 font-medium ml-2">/ {areas.find(a => a.id === 'entrance')?.capacityLimit}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-slate-800">Ticket Database</h2>
          <form onSubmit={addTicket} className="flex gap-2 w-full sm:w-auto">
            <input 
              className="border border-slate-300 rounded-lg px-4 py-2 w-full sm:w-64 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm shadow-inner" 
              placeholder="Generate New Code" 
              value={newCode} 
              onChange={e => setNewCode(e.target.value)} 
            />
            <button type="submit" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-sm">
              Add
            </button>
            <button 
              type="button" 
              onClick={() => {
                let code;
                do { code = generateId().toUpperCase(); } while (tickets.some(t => t.code === code));
                setTickets([...tickets, { id: generateId(), code, status: 'valid' }]);
              }} 
              className="bg-slate-100 text-slate-700 border border-slate-200 px-5 py-2 rounded-lg font-bold hover:bg-slate-200 transition-colors whitespace-nowrap shadow-sm"
            >
              Generate Random
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</span>
            <span className="text-2xl font-black text-slate-800">{tickets.length}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Valid</span>
            <span className="text-2xl font-black text-emerald-700">{tickets.filter(t => t.status === 'valid').length}</span>
          </div>
          <div className="bg-slate-100 border border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">Activated</span>
            <span className="text-2xl font-black text-slate-700">{tickets.filter(t => t.status === 'activated').length}</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Banned</span>
            <span className="text-2xl font-black text-red-700">{tickets.filter(t => t.status === 'banned').length}</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm">
          <table className="min-w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 font-bold text-slate-600 text-xs uppercase tracking-wider">Ticket Code</th>
                <th className="py-4 px-6 font-bold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 font-bold text-slate-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {tickets.length === 0 && (
                <tr><td colSpan="3" className="py-12 px-6 text-center text-slate-400 font-medium">No tickets found in the database.</td></tr>
              )}
              {tickets.map(ticket => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-700">{ticket.code}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-md text-[11px] font-black uppercase tracking-wider
                      ${ticket.status === 'valid' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                        ticket.status === 'activated' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 
                        'bg-red-100 text-red-800 border border-red-200'}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-end gap-3">
                    {ticket.status === 'valid' && (
                      <button onClick={() => activateTicket(ticket.id)} className="text-emerald-600 font-bold hover:text-emerald-800 transition-colors text-sm px-2 py-1 rounded hover:bg-emerald-50">Activate</button>
                    )}
                    {ticket.status !== 'banned' && (
                      <button onClick={() => banTicket(ticket.id)} className="text-orange-600 font-bold hover:text-orange-800 transition-colors text-sm px-2 py-1 rounded hover:bg-orange-50">Ban</button>
                    )}
                    <button onClick={() => deleteTicket(ticket.id)} className="text-red-600 font-bold hover:text-red-800 transition-colors text-sm px-2 py-1 rounded hover:bg-red-50">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CrowdControl({ areas, setAreas }) {
  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaCap, setNewAreaCap] = useState('');
  
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  useEffect(() => {
    if (areas.length > 0) {
      if (!transferFrom || !areas.find(a => a.id === transferFrom)) setTransferFrom(areas[0].id);
      if (!transferTo || !areas.find(a => a.id === transferTo)) setTransferTo(areas[areas.length > 1 ? 1 : 0].id);
    }
  }, [areas]);

  const addArea = (e) => {
    e.preventDefault();
    if (!newAreaName.trim() || !newAreaCap) return;
    setAreas([...areas, { 
      id: generateId(), 
      name: newAreaName, 
      currentPeople: 0, 
      capacityLimit: Number(newAreaCap), 
      isDefault: false 
    }]);
    setNewAreaName('');
    setNewAreaCap('');
  };

  const deleteArea = (id) => {
    if (window.confirm("Are you sure you want to delete this area?")) {
      setAreas(areas.filter(a => a.id !== id || a.isDefault));
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();
    const amount = Number(transferAmount);
    if (!amount || amount <= 0) return;
    if (transferFrom === transferTo) {
      alert("Please select different areas for transfer.");
      return;
    }

    const fromArea = areas.find(a => a.id === transferFrom);
    if (fromArea.currentPeople < amount) {
      alert(`Cannot transfer ${amount} people. Only ${fromArea.currentPeople} in ${fromArea.name}.`);
      return;
    }

    setAreas(areas.map(a => {
      if (a.id === transferFrom) return { ...a, currentPeople: Number(a.currentPeople) - amount };
      if (a.id === transferTo) return { ...a, currentPeople: Number(a.currentPeople) + amount };
      return a;
    }));
    setTransferAmount('');
  };

  const totalCapacity = areas.reduce((sum, a) => sum + Number(a.capacityLimit), 0);
  const totalCurrent = areas.reduce((sum, a) => sum + Number(a.currentPeople), 0);
  const globalOver = totalCurrent > totalCapacity;

  return (
    <div className="space-y-6">
      {globalOver && (
        <div className="bg-red-500 text-white p-5 rounded-xl shadow-lg font-bold text-center animate-pulse flex items-center justify-center gap-3 border-4 border-red-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
           <span className="text-lg">CRITICAL: TOTAL FESTIVAL LIMIT EXCEEDED! ({totalCurrent} / {totalCapacity})</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">Areas Overview</h2>
              <div className="text-sm font-bold bg-slate-100 px-4 py-2 rounded-lg text-slate-700 border border-slate-200 shadow-inner flex gap-2 items-center">
                Global Capacity: 
                <span className={`text-lg ${globalOver ? 'text-red-600' : 'text-emerald-600'}`}>
                  {totalCurrent}
                </span> 
                <span className="text-slate-400">/ {totalCapacity}</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {areas.map(area => {
                const overCap = area.currentPeople > area.capacityLimit;
                const percent = Math.min(100, (area.currentPeople / area.capacityLimit) * 100) || 0;
                
                return (
                  <div key={area.id} className={`p-5 rounded-xl border-2 transition-all relative overflow-hidden bg-white shadow-sm hover:shadow-md
                    ${overCap ? 'border-red-500' : 'border-slate-200 hover:border-indigo-300'}`}>
                    
                    {/* Progress Bar Background */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                      <div className={`h-full transition-all duration-500 ease-out ${overCap ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${percent}%` }}></div>
                    </div>

                    <div className="flex justify-between items-start mb-4 mt-2 relative z-10">
                      <div>
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                          {area.name} 
                          {area.isDefault && <span className="bg-slate-800 text-white text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider font-black shadow-sm">Main</span>}
                        </h3>
                      </div>
                      {!area.isDefault && (
                        <button onClick={() => deleteArea(area.id)} className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 hover:bg-red-50 p-1.5 rounded-md">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                           </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex items-end gap-2 relative z-10">
                      <span className={`text-5xl font-black tracking-tight ${overCap ? 'text-red-600' : 'text-slate-800'}`}>{area.currentPeople}</span>
                      <span className="text-slate-500 font-bold mb-1">/ {area.capacityLimit}</span>
                    </div>
                    {overCap && (
                      <div className="bg-red-50 text-red-600 text-xs font-bold mt-4 p-2 rounded-md flex items-center justify-center gap-1 border border-red-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        OVER CAPACITY
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Zone
            </h2>
            <form onSubmit={addArea} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Area Name</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500" 
                  placeholder="e.g. VIP Lounge" 
                  value={newAreaName} 
                  onChange={e => setNewAreaName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Capacity</label>
                <input 
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500" 
                  type="number" 
                  min="1" 
                  placeholder="e.g. 50" 
                  value={newAreaCap} 
                  onChange={e => setNewAreaCap(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-indigo-500 transition-colors mt-2 shadow-md">
                Deploy Area
              </button>
            </form>
          </div>

          <div className="bg-indigo-50 p-6 rounded-xl shadow-sm border-2 border-indigo-200">
            <h2 className="text-lg font-black mb-5 text-indigo-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Crowd Transfer
            </h2>
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                <label className="block text-xs font-black text-indigo-400 uppercase tracking-wide mb-1">From Source</label>
                <select 
                  className="w-full bg-transparent outline-none font-bold text-slate-700 cursor-pointer" 
                  value={transferFrom} 
                  onChange={e => setTransferFrom(e.target.value)}
                >
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name} (Pop: {a.currentPeople})</option>)}
                </select>
              </div>
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                <label className="block text-xs font-black text-indigo-400 uppercase tracking-wide mb-1">To Destination</label>
                <select 
                  className="w-full bg-transparent outline-none font-bold text-slate-700 cursor-pointer" 
                  value={transferTo} 
                  onChange={e => setTransferTo(e.target.value)}
                >
                  {areas.map(a => <option key={a.id} value={a.id}>{a.name} (Pop: {a.currentPeople})</option>)}
                </select>
              </div>
              <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                <label className="block text-xs font-black text-indigo-400 uppercase tracking-wide mb-1">Headcount</label>
                <input 
                  className="w-full bg-transparent outline-none font-bold text-slate-700 placeholder-slate-300" 
                  type="number" 
                  min="1" 
                  placeholder="Enter amount..." 
                  value={transferAmount} 
                  onChange={e => setTransferAmount(e.target.value)} 
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-3.5 rounded-lg font-black hover:bg-indigo-700 transition-all shadow-md mt-4 uppercase tracking-widest text-sm">
                Execute Move
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');

  const [tickets, setTickets] = useState([]);
  const [areas, setAreas] = useState([
    { id: 'entrance', name: 'Entrance', currentPeople: 0, capacityLimit: 10, isDefault: true }
  ]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(prevTasks => {
      let manualTasks = prevTasks.filter(t => !t.isAutoTask);
      let autoTasks = prevTasks.filter(t => t.isAutoTask);
      let newAutoTasks = [];

      const totalCapacity = areas.reduce((sum, a) => sum + Number(a.capacityLimit), 0);
      const totalPeople = areas.reduce((sum, a) => sum + Number(a.currentPeople), 0);

      // Logic 1: Global
      if (totalPeople > totalCapacity) {
        let existingGlobal = autoTasks.find(t => t.linkedAreaId === 'global');
        if (existingGlobal) {
          newAutoTasks.push(existingGlobal);
        } else {
          newAutoTasks.push({
            id: generateId(),
            title: "CRITICAL: Total festival limit exceeded!",
            status: "in progress",
            isAutoTask: true,
            linkedAreaId: 'global'
          });
        }
      }

      // Logic 2: Area specific
      areas.forEach(area => {
        if (Number(area.currentPeople) > Number(area.capacityLimit)) {
          let existingAreaTask = autoTasks.find(t => t.linkedAreaId === area.id);
          if (existingAreaTask) {
             newAutoTasks.push(existingAreaTask);
          } else {
             newAutoTasks.push({
              id: generateId(),
              title: `ALERT: Too many people in ${area.name}`,
              status: "in progress",
              isAutoTask: true,
              linkedAreaId: area.id
            });
          }
        }
      });

      const changed = autoTasks.length !== newAutoTasks.length || 
                      !autoTasks.every((t, i) => t.id === newAutoTasks[i]?.id);
      
      if (changed) {
        return [...manualTasks, ...newAutoTasks];
      }
      return prevTasks;
    });
  }, [areas]);

  const renderTabContent = () => {
    switch(activeTab) {
      case 'tasks': return <TaskBoard tasks={tasks} setTasks={setTasks} />;
      case 'tickets': return <TicketControl tickets={tickets} setTickets={setTickets} areas={areas} setAreas={setAreas} />;
      case 'areas': return <CrowdControl areas={areas} setAreas={setAreas} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-200">
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-2.5 rounded-xl shadow-md">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              ZahidControl <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md ml-1 text-xl">SUPER PRO MAX</span>
            </h1>
          </div>
          <nav className="flex space-x-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            {[
              { id: 'tasks', label: 'Task Board' },
              { id: 'tickets', label: 'Tickets & Entrance' },
              { id: 'areas', label: 'Crowd Control' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ease-out ${
                  activeTab === tab.id 
                    ? 'bg-white text-indigo-700 shadow-sm border border-slate-200 scale-100' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 scale-95 hover:scale-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        {renderTabContent()}
      </main>
    </div>
  )
}
