import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface TasbihCounterWidgetProps {
  phrase: string;
  phraseTranslation: string;
  count: number;
  target: number;
}

export const TasbihCounterWidget: React.FC<TasbihCounterWidgetProps> = ({
  phrase,
  phraseTranslation,
  count,
  target,
}) => {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#030712',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#1f2937',
        borderWidth: 1.5,
      }}
    >
      {/* Title Header */}
      <TextWidget
        text="📿 Tasbih Counter"
        style={{
          color: '#f59e0b',
          fontSize: 13,
          fontWeight: 'bold',
        }}
      />

      {/* Phrase & Translation */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 6,
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={phrase}
          style={{
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        />
        <TextWidget
          text={phraseTranslation}
          style={{
            color: '#9ca3af',
            fontSize: 11,
            textAlign: 'center',
            marginTop: 4,
          }}
        />
      </FlexWidget>

      {/* Progress Counter Text */}
      <TextWidget
        text={`${count} / ${target}`}
        style={{
          color: '#3b82f6',
          fontSize: 22,
          fontWeight: 'bold',
        }}
      />

      {/* Interactive Controls Row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginTop: 8,
        }}
      >
        {/* Reset Button */}
        <FlexWidget
          clickAction="RESET"
          style={{
            backgroundColor: '#1f2937',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#374151',
            borderWidth: 1,
          }}
        >
          <TextWidget
            text="Reset"
            style={{
              color: '#d1d5db',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Increment Button */}
        <FlexWidget
          clickAction="INCREMENT"
          style={{
            backgroundColor: '#2563eb',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#3b82f6',
            borderWidth: 1,
          }}
        >
          <TextWidget
            text="+1"
            style={{
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
};
