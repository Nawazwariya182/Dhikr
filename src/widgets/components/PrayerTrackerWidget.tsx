import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface PrayerTrackerWidgetProps {
  fajr: boolean | 'qaza';
  dhuhr: boolean | 'qaza';
  asr: boolean | 'qaza';
  maghrib: boolean | 'qaza';
  isha: boolean | 'qaza';
  streak: number;
}

export const PrayerTrackerWidget: React.FC<PrayerTrackerWidgetProps> = ({
  fajr,
  dhuhr,
  asr,
  maghrib,
  isha,
  streak,
}) => {
  const prayers = [
    { key: 'fajr', name: 'Fajr', status: fajr, action: 'TOGGLE_FAJR' },
    { key: 'dhuhr', name: 'Dhuhr', status: dhuhr, action: 'TOGGLE_DHUHR' },
    { key: 'asr', name: 'Asr', status: asr, action: 'TOGGLE_ASR' },
    { key: 'maghrib', name: 'Maghrib', status: maghrib, action: 'TOGGLE_MAGHRIB' },
    { key: 'isha', name: 'Isha', status: isha, action: 'TOGGLE_ISHA' },
  ];

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#030712',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#1f2937',
        borderWidth: 1.5,
      }}
    >
      {/* Header Row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text="🕌 Today's Prayers"
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
        
        {/* Simple Circular Streak Button on Top Right */}
        <FlexWidget
          clickAction="OPEN_URI"
          clickActionData={{ uri: 'dhikr://prayer-tracker' }}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#1e293b',
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#f59e0b',
            borderWidth: 2,
          }}
        >
          <TextWidget
            text={streak > 0 ? `${streak}` : '🔥'}
            style={{
              color: '#f59e0b',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Prayers Row (bottom part) */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          width: 'match_parent',
          marginTop: 12,
        }}
      >
        {prayers.map((p) => {
          const isPrayed = p.status === true;
          const isQaza = p.status === 'qaza';
          const isCompleted = isPrayed || isQaza;

          return (
            <FlexWidget
              key={p.key}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Clickable Circle */}
              <FlexWidget
                clickAction={p.action}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  borderWidth: 2.5,
                  borderColor: isPrayed ? '#10b981' : isQaza ? '#f59e0b' : '#4b5563',
                  backgroundColor: isPrayed ? '#10b98122' : isQaza ? '#f59e0b22' : '#111827',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <TextWidget
                  text={isCompleted ? '✓' : ''}
                  style={{
                    color: isPrayed ? '#10b981' : '#f59e0b',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}
                />
              </FlexWidget>

              {/* Label */}
              <TextWidget
                text={p.name}
                style={{
                  color: isPrayed ? '#10b981' : isQaza ? '#f59e0b' : '#9ca3af',
                  fontSize: 11,
                  fontWeight: isCompleted ? 'bold' : '600',
                }}
              />
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
};
