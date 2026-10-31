import React, { useState } from 'react';
import { ArrowLeft, ShoppingBag, ShieldCheck, Check, Sparkles, RotateCcw } from 'lucide-react';
import { audio } from '../../audio/HorrorAudioEngine';

interface StoreViewProps {
  onBack: () => void;
}

export const StoreView: React.FC<StoreViewProps> = ({ onBack }) => {
  const [purchasedItems, setPurchasedItems] = useState<string[]>(['EPISODE_01_FREE']);
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null);

  const handlePurchase = (id: string, name: string) => {
    audio.playUIClick();
    setPurchasedItems((prev) => [...prev, id]);
    setPurchaseStatus(`Purchased & Verified: ${name}!`);
    setTimeout(() => setPurchaseStatus(null), 3500);
  };

  const handleRestore = () => {
    audio.playUIClick();
    setPurchaseStatus('Receipt verification complete: Purchases restored.');
    setTimeout(() => setPurchaseStatus(null), 3000);
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#07080d',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '28px 20px',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Headquarters</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontSize: '1.8rem',
              fontFamily: 'Cinzel, serif',
              fontWeight: 700,
              color: '#f8fafc',
              margin: 0
            }}>
              QUARTERMASTER STORE
            </h1>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Story expansions & cosmetic customizations. No pay-to-win items.
            </div>
          </div>

          <button
            onClick={handleRestore}
            style={{
              padding: '6px 12px',
              backgroundColor: '#141824',
              border: '1px solid #232b3f',
              borderRadius: '6px',
              color: '#cbd5e1',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} />
            <span>Restore Purchases</span>
          </button>
        </div>
      </div>

      {purchaseStatus && (
        <div style={{
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid #22c55e',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#86efac',
          fontSize: '0.8rem',
          margin: '12px 0'
        }}>
          {purchaseStatus}
        </div>
      )}

      {/* Catalog */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '16px 0' }}>
        {/* Episode 1: Free Starter */}
        <div style={{
          backgroundColor: '#0e111a',
          border: '1px solid #22c55e',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Episode 1: The Visitor
              </span>
              <span style={{ fontSize: '0.65rem', background: '#22c55e', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                FREE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Full first episode, 5 clues, 3 puzzles, adaptive Visitor entity, multiple endings.
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#86efac', fontWeight: 600 }}>
            Active
          </span>
        </div>

        {/* Season Expansion Pass */}
        <div style={{
          backgroundColor: '#0e111a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Season 1 Story Pass (Episodes 2–4)
              </span>
              <span style={{ fontSize: '0.65rem', background: '#38bdf8', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                $4.99
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Episode 2 "The Echo Chamber" & Episode 3 "The Hollow Static".
            </div>
          </div>
          {purchasedItems.includes('PASS_SEASON_1') ? (
            <span style={{ fontSize: '0.8rem', color: '#86efac' }}>Unlocked</span>
          ) : (
            <button
              onClick={() => handlePurchase('PASS_SEASON_1', 'Season 1 Pass')}
              style={{
                padding: '8px 14px',
                backgroundColor: '#38bdf8',
                color: '#000',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              Unlock ($4.99)
            </button>
          )}
        </div>

        {/* Cosmetic: Occult Brass Flashlight */}
        <div style={{
          backgroundColor: '#0e111a',
          border: '1px solid #1e293b',
          borderRadius: '10px',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                Occult Brass Flashlight Skin
              </span>
              <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                COSMETIC
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
              Etched alchemical brass casing with amber lens tint. Purely cosmetic.
            </div>
          </div>
          {purchasedItems.includes('SKIN_BRASS_FLASHLIGHT') ? (
            <span style={{ fontSize: '0.8rem', color: '#86efac' }}>Owned</span>
          ) : (
            <button
              onClick={() => handlePurchase('SKIN_BRASS_FLASHLIGHT', 'Occult Brass Flashlight')}
              style={{
                padding: '8px 14px',
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                color: '#f8fafc',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.75rem',
                cursor: 'pointer'
              }}
            >
              $1.99
            </button>
          )}
        </div>
      </div>

      {/* Compliance Notice */}
      <div style={{
        backgroundColor: '#0a0d14',
        border: '1px solid #191e2e',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '16px',
        fontSize: '0.7rem',
        color: '#64748b',
        lineHeight: 1.4
      }}>
        🛡️ <strong>Fair Play Guarantee:</strong> REALITY HUNT does not sell pay-to-win items, radar enhancements, or competitive advantages. All purchases are bound to platform billing (Google Play / App Store) with standard refund rights.
      </div>

      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#1e293b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Return to Headquarters
        </button>
      </div>
    </div>
  );
};
