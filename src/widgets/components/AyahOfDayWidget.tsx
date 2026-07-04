import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface AyahOfDayWidgetProps {
  arabic: string;
  translation: string;
  surahName: string;
  surah: number;
  ayah: number;
}

export const AyahOfDayWidget: React.FC<AyahOfDayWidgetProps> = ({
  arabic,
  translation,
  surahName,
  surah,
  ayah,
}) => {
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: `dhikr://surah?surahId=${surah}&initialAyah=${ayah}` }}
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
      {/* Header Info */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottomWidth: 1.5,
          borderBottomColor: '#1f2937',
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="✨ Ayah of the Day"
          style={{
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={`${surahName} ${surah}:${ayah}`}
          style={{
            color: '#9ca3af',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Arabic text block */}
      <FlexWidget
        style={{
          flex: 1.2,
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingVertical: 4,
        }}
      >
        <TextWidget
          text={arabic}
          style={{
            color: '#ffffff',
            fontSize: 22,
            textAlign: 'right',
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* English/Urdu translation text block */}
      <FlexWidget
        style={{
          marginTop: 8,
          borderTopWidth: 1.5,
          borderTopColor: '#1f2937',
          paddingTop: 6,
          flex: 1,
        }}
      >
        <TextWidget
          text={translation}
          style={{
            color: '#cbd5e1',
            fontSize: 12,
            textAlign: 'left',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
