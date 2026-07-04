import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface DuaOfDayWidgetProps {
  arabic: string;
  translation: string;
  reference: string;
}

export const DuaOfDayWidget: React.FC<DuaOfDayWidgetProps> = ({
  arabic,
  translation,
  reference,
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
          text="🤲 Dua of the Day"
          style={{
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={reference}
          style={{
            color: '#9ca3af',
            fontSize: 11,
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
            fontSize: 20,
            textAlign: 'right',
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Translation text block */}
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
