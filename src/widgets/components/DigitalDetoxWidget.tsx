import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DigitalDetoxWidgetProps {
  spiritualTime: number; // in minutes
  spiritualGoal: number; // in minutes
  otherTime: number; // in minutes
}

export const DigitalDetoxWidget: React.FC<DigitalDetoxWidgetProps> = ({
  spiritualTime,
  spiritualGoal,
  otherTime,
}) => {
  const percent = Math.max(5, Math.min(100, Math.round((spiritualTime / spiritualGoal) * 100)));
  
  return (
    <FlexWidget
      clickAction="OPEN_APP"
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
      <FlexWidget style={{ flexDirection: 'column', width: 'match_parent' }}>
        {/* Header */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <FlexWidget
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#3b82f620',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <TextWidget allowFontScaling={false}
              text={String.fromCharCode(0xe8b5)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#3b82f6',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget allowFontScaling={false}
            text="DETOX TRACKER"
            style={{
              color: '#3b82f6',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Time statistics */}
        <FlexWidget style={{ flexDirection: 'column', marginTop: 4 }}>
          <TextWidget allowFontScaling={false}
            text={`${spiritualTime} mins`}
            style={{
              color: '#ffffff',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          />
          <TextWidget allowFontScaling={false}
            text="Quran & Remembrance"
            style={{
              color: '#9ca3af',
              fontSize: 12,
            }}
          />
        </FlexWidget>

        {/* Other screen time estimate */}
        <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
          <TextWidget allowFontScaling={false}
            text="Goal Progress:"
            style={{ color: '#9ca3af', fontSize: 11 }}
          />
          <TextWidget allowFontScaling={false}
            text={`${percent}%`}
            style={{ color: '#f59e0b', fontSize: 11, fontWeight: 'bold' }}
          />
        </FlexWidget>

        {/* Progress Bar */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 6,
            backgroundColor: '#1f2937',
            borderRadius: 3,
            marginTop: 4,
            flexDirection: 'row',
          }}
        >
          <FlexWidget
            style={{
              flex: percent,
              height: 'match_parent',
              backgroundColor: '#3b82f6',
              borderRadius: 3,
            }}
          />
          {percent < 100 && (
            <FlexWidget
              style={{
                flex: 100 - percent,
                height: 'match_parent',
              }}
            />
          )}
        </FlexWidget>
      </FlexWidget>

      {/* Footer */}
      <TextWidget allowFontScaling={false}
        text="Stay connected to Allah!"
        style={{
          color: '#10b981',
          fontSize: 11,
          fontWeight: 'bold',
          textAlign: 'center',
          width: 'match_parent',
        }}
      />
    </FlexWidget>
  );
};
