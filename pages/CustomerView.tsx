import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queueService } from '../services/queueService';
import { QueueState, Token, TokenStatus } from '../types';
import { User, Clock, ArrowRight } from 'lucide-react';

export const CustomerView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<QueueState>(queueService.getQueueStatus());
  const [myTokenId, setMyTokenId] = useState<string | null>(localStorage.getItem('my_token_id'));
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = queueService.subscribe(() => {
      setState(queueService.getQueueStatus());
    });
    return unsubscribe;
  }, []);

  const myToken = useMemo(() => 
    state.tokens.find(t => t.id === myTokenId), 
  [state.tokens, myTokenId]);

  const peopleAhead = useMemo(() => {
    if (!myToken || myToken.status !== TokenStatus.WAITING) return 0;
    return state.tokens.filter(t => 
      t.status === TokenStatus.WAITING && t.number < myToken.number
    ).length;
  }, [state.tokens, myToken]);

  const handleRegister = () => {
    setIsRegistering(true);
    // Simulate network delay
    setTimeout(() => {
      const token = queueService.registerToken();
      setMyTokenId(token.id);
      localStorage.setItem('my_token_id', token.id);
      setIsRegistering(false);
    }, 600);
  };

  const handleLeave = () => {
    setMyTokenId(null);
    localStorage.removeItem('my_token_id');
  };

  // 1. Initial State: Register
  if (!myTokenId || !myToken) {
    return (
      <div className="max-w-md mx-auto pt-10 px-4">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-blue-600 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">{state.shopName}</h1>
            <p className="text-blue-100">Welcome! Please take a number.</p>
          </div>
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full bg-blue-50 text-blue-600 mb-4">
                <User className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Join the Queue</h2>
              <p className="text-gray-500 mt-2">Get a digital token and track your status in real-time.</p>
            </div>
            
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform transition active:scale-95 flex items-center justify-center space-x-2"
            >
              {isRegistering ? (
                <span>Getting Token...</span>
              ) : (
                <>
                  <span>Get My Token</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="mt-6 text-center text-sm text-gray-400">
              <p>Current Serving: <strong>#{state.currentServingNumber || '--'}</strong></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Waiting State
  const isMyTurn = myToken.status === TokenStatus.SERVING;
  const isCompleted = myToken.status === TokenStatus.COMPLETED;

  return (
    <div className="max-w-md mx-auto pt-4 px-4 pb-20">
      
      {/* Header Info */}
      <div className="text-center mb-6">
        <h1 className="font-bold text-gray-800 text-lg">{state.shopName}</h1>
        <p className="text-xs text-gray-500">Queue ID: {state.shopId}</p>
      </div>

      {/* Main Status Card */}
      <div className={`relative rounded-3xl p-8 text-center shadow-lg transition-colors duration-500 ${
        isMyTurn ? 'bg-green-500 text-white' : 
        isCompleted ? 'bg-gray-800 text-white' : 
        'bg-white text-gray-800'
      }`}>
        <h2 className={`uppercase text-sm font-semibold tracking-wider mb-2 ${isMyTurn ? 'text-green-100' : 'text-gray-400'}`}>
          Your Token
        </h2>
        <div className={`text-7xl font-black mb-4 tracking-tighter ${isMyTurn || isCompleted ? 'text-white' : 'text-blue-600'}`}>
          #{myToken.number}
        </div>
        
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            isMyTurn ? 'bg-white text-green-600' :
            isCompleted ? 'bg-gray-700 text-gray-300' :
            'bg-blue-50 text-blue-700'
          }`}>
          {isMyTurn ? 'It\'s Your Turn!' : 
           isCompleted ? 'Completed' :
           'Waiting in Line'}
        </div>
      </div>

      {/* Stats Grid */}
      {!isMyTurn && !isCompleted && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800 mb-1">{peopleAhead}</span>
            <span className="text-xs text-gray-500 font-medium uppercase">Ahead of you</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-3xl font-bold text-gray-800 mb-1">~{peopleAhead * 5}m</span>
            <span className="text-xs text-gray-500 font-medium uppercase">Est. Wait</span>
          </div>
        </div>
      )}

      {/* Current Serving Info (if not me) */}
      {!isMyTurn && (
        <div className="mt-6 bg-blue-900 text-white rounded-2xl p-6 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Currently Serving</p>
            <p className="text-3xl font-bold">#{state.currentServingNumber || '--'}</p>
          </div>
          <div className="bg-blue-800 p-3 rounded-full">
            <User className="w-6 h-6 text-blue-200" />
          </div>
        </div>
      )}

      {/* Action */}
      {isCompleted && (
         <div className="mt-8 text-center">
           <p className="text-gray-500 mb-4">Thank you for visiting!</p>
           <button onClick={handleLeave} className="text-blue-600 font-medium hover:underline">
             Get a new token
           </button>
         </div>
      )}

       {!isCompleted && !isMyTurn && (
         <div className="mt-8 text-center">
           <button onClick={handleLeave} className="text-sm text-red-400 hover:text-red-600">
             Leave Queue
           </button>
         </div>
      )}
    </div>
  );
};