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
        {/* Header Block */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <FlexWidget
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#f59e0b20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <TextWidget
              text={String.fromCharCode(0xe0f0)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#f59e0b',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget
            text="DUA OF THE DAY"
            style={{
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Supplication text */}
        <TextWidget
          text={arabic}
          style={{
            color: '#ffffff',
            fontSize: 19,
            marginTop: 4,
            fontFamily: 'UthmanicHafs1Ver18',
            textAlign: 'right',
            width: 'match_parent',
          }}
        />

        {/* Translation */}
        <TextWidget
          text={translation}
          style={{
            color: '#9ca3af',
            fontSize: 12,
            marginTop: 8,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Reference footer */}
      <TextWidget
        text={`- ${reference}`}
        style={{
          color: '#3b82f6',
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 6,
          textAlign: 'right',
          width: 'match_parent',
        }}
      />
    </FlexWidget>
  );
};
