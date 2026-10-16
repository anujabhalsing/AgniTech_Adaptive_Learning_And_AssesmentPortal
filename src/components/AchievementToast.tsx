import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { useApp } from '../context/AppContext';

export default function AchievementToast() {
  const { state, dispatch } = useApp();
  const { newAchievements } = state;

  useEffect(() => {
    if (newAchievements.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_NEW_ACHIEVEMENTS' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [newAchievements, dispatch]);

  if (newAchievements.length === 0) return null;

  const ach = newAchievements[newAchievements.length - 1];

  return (
    <div className="achievement-popup" role="alert" aria-live="polite">
      <div style={{
        background: 'linear-gradient(135deg, #1E293B, #0F172A)',
        color: 'white',
        borderRadius: 14,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        maxWidth: 320,
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontSize: 32 }}>{ach.icon}</div>
        <div>
          <div style={{ fontSize: 11, color: '#7C3AED', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Achievement Unlocked!
          </div>
          <div style={{ fontWeight: 700, fontSize: 15, marginTop: 2 }}>{ach.title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>
            {ach.description} · +{ach.xpReward} XP
          </div>
        </div>
      </div>
    </div>
  );
}
