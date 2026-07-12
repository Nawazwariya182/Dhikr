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
      clickAction="INCREMENT"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#090d16',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#1e293b',
        borderWidth: 1.5,
      }}
    >
      {/* Title Header */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: 'match_parent',
          marginBottom: 6,
          paddingBottom: 4,
        }}
      >
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
            text={String.fromCharCode(0xe863)}
            style={{
              fontFamily: 'MaterialIcons',
              color: '#f59e0b',
              fontSize: 18,
            }}
          />
        </FlexWidget>
        <TextWidget allowFontScaling={false}
          text="TASBIH COUNTER"
          style={{
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Phrase Info */}
      <FlexWidget
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 4,
          width: 'match_parent',
        }}
      >
        <TextWidget allowFontScaling={false}
          text={phrase}
          style={{
            color: '#ffffff',
            fontSize: 22,
            textAlign: 'center',
            fontFamily: 'UthmanicHafs1Ver18',
            width: 'match_parent',
          }}
        />
        <TextWidget allowFontScaling={false}
          text={phraseTranslation}
          style={{
            color: '#9ca3af',
            fontSize: 12,
            textAlign: 'center',
            marginTop: 4,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Counter */}
      <TextWidget allowFontScaling={false}
        text={target > 0 ? `${count} / ${target}` : `${count}`}
        style={{
          color: '#3b82f6',
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      />

      {/* Actions */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginTop: 6,
        }}
      >
        <FlexWidget
          clickAction="RESET"
          style={{
            flex: 1,
            backgroundColor: '#1f2937',
            borderRadius: 10,
            paddingVertical: 7,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#374151',
            borderWidth: 1,
            marginRight: 6,
          }}
        >
          <TextWidget allowFontScaling={false}
            text="Reset"
            style={{
              color: '#d1d5db',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        <FlexWidget
          clickAction="INCREMENT"
          style={{
            flex: 2,
            backgroundColor: '#2563eb',
            borderRadius: 10,
            paddingVertical: 7,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#3b82f6',
            borderWidth: 1,
          }}
        >
          <TextWidget allowFontScaling={false}
            text="+1"
            style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    </FlexWidget>
  );
};
