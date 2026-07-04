import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface JuzProgressWidgetProps {
  juzNumber: number;
  progressPercent: number;
  versesRead: number;
  totalVerses: number;
}

export const JuzProgressWidget: React.FC<JuzProgressWidgetProps> = ({
  juzNumber,
  progressPercent,
  versesRead,
  totalVerses,
}) => {
  // Safe bounded percentage
  const pct = Math.max(0, Math.min(100, Math.round(progressPercent)));
  
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `dhikr://surah?juzNumber=${juzNumber}` }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#030712',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-around',
        borderColor: '#1f2937',
        borderWidth: 1.5,
      }}
    >
      {/* Label and Info */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <TextWidget
          text={`Juz ${juzNumber} Progress`}
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={`${pct}% (${versesRead}/${totalVerses})`}
          style={{
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Progress Bar Track */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 10,
          backgroundColor: '#111827',
          borderRadius: 5,
          flexDirection: 'row',
          overflow: 'hidden',
          marginTop: 6,
          borderColor: '#1f2937',
          borderWidth: 1,
        }}
      >
        {/* Progress Filled */}
        <FlexWidget
          style={{
            flex: pct,
            width: 0,
            height: 'match_parent',
            backgroundColor: '#2563eb',
          }}
        />
        {/* Remaining Empty Track */}
        <FlexWidget
          style={{
            flex: 100 - pct,
            width: 0,
            height: 'match_parent',
            backgroundColor: '#111827',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
