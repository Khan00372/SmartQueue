import React, { useEffect, useState, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { queueService } from '../services/queueService';
import { QueueState, Token, TokenStatus } from '../types';
import { AdminControls } from '../components/AdminControls';
import { Users, Clock, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [state, setState] = useState<QueueState>(queueService.getQueueStatus());

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = queueService.subscribe(() => {
      setState(queueService.getQueueStatus());
    });
    return unsubscribe;
  }, []);

  const waitingTokens = useMemo(() => 
    state.tokens.filter(t => t.status === TokenStatus.WAITING), 
  [state.tokens]);

  const completedTokens = useMemo(() => 
    state.tokens.filter(t => t.status === TokenStatus.COMPLETED), 
  [state.tokens]);

  const currentToken = useMemo(() => 
    state.tokens.find(t => t.number === state.currentServingNumber && t.status === TokenStatus.SERVING),
  [state.tokens, state.currentServingNumber]);

  // Derived Stats
  const avgWaitTime = 15; // Mock calculation
  
  const qrValue = `${window.location.origin}/#/queue?shop_id=${state.shopId}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT COLUMN: Controls & Status */}
        <div className="flex-1 space-y-6">
          
          {/* Active Token Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-500"></div>
            <h2 className="text-gray-500 font-medium uppercase tracking-wider text-sm mb-2">Now Serving</h2>
            <div className="text-8xl font-black text-blue-600 mb-4 tracking-tighter">
              {currentToken ? `#${currentToken.number}` : '--'}
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
              {currentToken ? 'In Progress' : 'Waiting for next'}
            </div>
          </div>

          {/* Action Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Controls</h3>
            <AdminControls 
              onNext={() => queueService.callNext()}
              onSkip={() => queueService.skipCurrent()}
              onComplete={() => queueService.completeCurrent()}
              onReset={() => queueService.resetQueue()}
              isQueueEmpty={waitingTokens.length === 0}
              hasActive={!!currentToken}
            />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-gray-400 mb-1"><Users className="w-5 h-5 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-800">{waitingTokens.length}</div>
              <div className="text-xs text-gray-500">Waiting</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-gray-400 mb-1"><CheckCircle2 className="w-5 h-5 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-800">{completedTokens.length}</div>
              <div className="text-xs text-gray-500">Served</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
              <div className="text-gray-400 mb-1"><Clock className="w-5 h-5 mx-auto" /></div>
              <div className="text-2xl font-bold text-gray-800">{avgWaitTime}m</div>
              <div className="text-xs text-gray-500">Avg Wait</div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Queue List & QR */}
        <div className="w-full md:w-80 space-y-6">
          
          {/* QR Code */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
            <h3 className="font-bold text-gray-800 mb-4">Join Queue</h3>
            <div className="bg-white p-2 rounded-lg border border-gray-200 mb-4">
              <QRCodeSVG value={qrValue} size={140} />
            </div>
            <p className="text-sm text-gray-500 mb-2">Scan to get a token</p>
            <a href={qrValue} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">Open Link</a>
          </div>

          {/* Waiting List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-96 flex flex-col">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
              <span>Up Next</span>
              <span className="text-xs font-normal text-gray-500">{waitingTokens.length} people</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {waitingTokens.length === 0 ? (
                <div className="text-center text-gray-400 py-10 text-sm">
                  Queue is empty
                </div>
              ) : (
                waitingTokens.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="font-bold text-gray-700">Token #{t.number}</span>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - t.createdAt) / 60000)}m ago
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};