import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface NamesOfAllahWidgetProps {
  name: string;
  arabic: string;
  meaning: string;
  benefit: string;
}

export const NamesOfAllahWidget: React.FC<NamesOfAllahWidgetProps> = ({
  name,
  arabic,
  meaning,
  benefit,
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
        {/* Header */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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
            <TextWidget allowFontScaling={false}
              text={String.fromCharCode(0xe8b5)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#f59e0b',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget allowFontScaling={false}
            text="ALLAH'S NAME"
            style={{
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Name in Arabic */}
        <TextWidget allowFontScaling={false}
          text={arabic}
          style={{
            color: '#ffffff',
            fontSize: 26,
            fontWeight: 'bold',
            textAlign: 'center',
            fontFamily: 'UthmanicHafs1Ver18',
            marginTop: 4,
            width: 'match_parent',
          }}
        />

        <TextWidget allowFontScaling={false}
          text={name}
          style={{
            color: '#3b82f6',
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 4,
            width: 'match_parent',
          }}
        />

        <TextWidget allowFontScaling={false}
          text={meaning}
          style={{
            color: '#9ca3af',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 2,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Benefit */}
      <TextWidget allowFontScaling={false}
        text={benefit}
        style={{
          color: '#10b981',
          fontSize: 11,
          textAlign: 'center',
          width: 'match_parent',
        }}
      />
    </FlexWidget>
  );
};
