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
    { label: '', name: 'Fajr', key: 'TOGGLE_FAJR', val: fajr },
    { label: '', name: 'Dhuhr', key: 'TOGGLE_DHUHR', val: dhuhr },
    { label: '', name: 'Asr', key: 'TOGGLE_ASR', val: asr },
    { label: '', name: 'Maghrib', key: 'TOGGLE_MAGHRIB', val: maghrib },
    { label: '', name: 'Isha', key: 'TOGGLE_ISHA', val: isha },
  ];

  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#090d16',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#1e293b',
        borderWidth: 1.5,
      }}
    >
      {/* Header and Streak Info */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 6,
        }}
      >
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FlexWidget
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#10b98120',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <TextWidget allowFontScaling={false}
              text={String.fromCharCode(0xe8b5)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#10b981',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget allowFontScaling={false}
            text="DAILY PRAYERS"
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        <TextWidget allowFontScaling={false}
          text={`${streak} Day Streak`}
          style={{
            color: '#f59e0b',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Prayer Circles Row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginTop: 6,
        }}
      >
        {prayers.map((p) => {
          const isCompleted = p.val === true;
          const isQaza = p.val === 'qaza';
          const isPrayed = isCompleted || isQaza;

          let color = '#1e293b'; // default uncompleted
          if (isCompleted) color = '#10b981'; // green
          if (isQaza) color = '#f59e0b'; // orange qaza (same color as in app qaza)

          return (
            <FlexWidget
              key={p.name}
              clickAction={p.key}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
              }}
            >
              {/* Rounded Box */}
              <FlexWidget
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: (isPrayed ? (color + '20') : '#111827') as any,
                  borderColor: color as any,
                  borderWidth: 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                <TextWidget allowFontScaling={false}
                  text={isCompleted ? String.fromCharCode(0xe5ca) : (isQaza ? String.fromCharCode(0xe86c) : p.label)}
                  style={{
                    fontFamily: isPrayed ? 'MaterialIcons' : undefined,
                    color: (isPrayed ? color : '#9ca3af') as any,
                    fontSize: isPrayed ? 22 : 14,
                    fontWeight: 'bold',
                  }}
                />
              </FlexWidget>

              <TextWidget allowFontScaling={false}
                text={p.name}
                style={{
                  color: isPrayed ? '#ffffff' : '#6b7280',
                  fontSize: 11,
                  fontWeight: 'bold',
                }}
              />
            </FlexWidget>
          );
        })}
      </FlexWidget>
    </FlexWidget>
  );
};
