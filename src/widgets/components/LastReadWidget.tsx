import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface LastReadWidgetProps {
  surahName: string;
  surahId: number;
  ayahNumber: number;
  hasHistory: boolean;
}

export const LastReadWidget: React.FC<LastReadWidgetProps> = ({
  surahName,
  surahId,
  ayahNumber,
  hasHistory,
}) => {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `dhikr://surah?surahId=${surahId}&initialAyah=${ayahNumber}` }}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#030712',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#1f2937',
        borderWidth: 1.5,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <TextWidget
          text={hasHistory ? "📖 Resume Reading" : "📖 Start Reading"}
          style={{
            color: '#f59e0b',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={`${surahName} — Ayah ${ayahNumber}`}
          style={{
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 4,
          }}
        />
      </FlexWidget>

      <FlexWidget
        style={{
          backgroundColor: '#2563eb',
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#3b82f6',
          borderWidth: 1,
        }}
      >
        <TextWidget
          text="Resume"
          style={{
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
