import React, { useState } from 'react';
import { InventoryItem } from '../../types/game';
import { audio } from '../../audio/HorrorAudioEngine';
import { Backpack, X, Flashlight, Radio, Zap, Compass, Play } from 'lucide-react';

interface InventoryViewProps {
  onClose: () => void;
  onLaunchPuzzle: (puzzleKey: string) => void;
}

const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 'ITEM_FLASHLIGHT',
    name: 'Tactical UV Flashlight',
    description: 'High-intensity LED flashlight equipped with ultraviolet spectrum filter. Essential for revealing hidden runic ward lines and deterring light-sensitive anomalies.',
    icon: 'Flashlight',
    category: 'tool',
    quantity: 1,
  },
  {
    id: 'ITEM_RADAR',
    name: 'Occult Frequency Scanner',
    description: 'Calibrated receiver detecting local electromagnetic deviations and spatial tears. Displays real-time proximity and fear index telemetry.',
    icon: 'Radio',
    category: 'tool',
    quantity: 1,
  },
  {
    id: 'ITEM_TUNING_FORK',
    name: 'Meteoric Tuning Fork (432 Hz)',
    description: 'Harmonically balanced alloy fork. When struck, resonates with the natural frequency of the spatial breach.',
    icon: 'Zap',
    category: 'relic',
    usableInPuzzle: 'ECHO_SEQUENCE',
    quantity: 1,
  },
  {
    id: 'ITEM_MERIDIAN_COMPASS',
    name: 'Runic Meridian Compass',
    description: 'Ancient magnetic device whose needle points toward metaphysical anomalies rather than magnetic north. Calibrates concentric ward rings.',
    icon: 'Compass',
    category: 'tool',
    usableInPuzzle: 'WARD_CIPHER',
    quantity: 1,
  },
];

export const InventoryView: React.FC<InventoryViewProps> = ({ onClose, onLaunchPuzzle }) => {
  const [items] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(items[0]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flashlight':
        return <Flashlight size={20} />;
      case 'Radio':
        return <Radio size={20} />;
      case 'Zap':
        return <Zap size={20} />;
      case 'Compass':
        return <Compass size={20} />;
      default:
        return <Backpack size={20} />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 6, 10, 0.95)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 85,
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '560px',
        backgroundColor: '#0f121d',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Backpack color="#10b981" size={24} />
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#f8fafc', margin: 0, fontWeight: 700 }}>
                FIELD INVESTIGATION GEAR
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Tactical Tools & Occult Relics
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Item Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {items.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  audio.playUIClick();
                }}
                style={{
                  height: '76px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? '#1e2438' : '#141724',
                  border: `1px solid ${isSelected ? '#10b981' : '#23283b'}`,
                  color: isSelected ? '#10b981' : '#94a3b8',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {getIcon(item.icon)}
                <span style={{ fontSize: '0.65rem', color: '#cbd5e1', textAlign: 'center', padding: '0 4px' }}>
                  {item.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Item Details */}
        {selectedItem && (
          <div style={{
            backgroundColor: '#0a0d14',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1rem' }}>
                {selectedItem.name}
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7'
              }}>
                {selectedItem.category.toUpperCase()}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              {selectedItem.description}
            </p>
          </div>
        )}

        {/* Action Button */}
        {selectedItem?.usableInPuzzle && (
          <button
            onClick={() => {
              onLaunchPuzzle(selectedItem.usableInPuzzle!);
              onClose();
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#10b981',
              color: '#062817',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Play size={16} />
            <span>Engage Diagnostic / Puzzle Console</span>
          </button>
        )}
      </div>
    </div>
  );
};
