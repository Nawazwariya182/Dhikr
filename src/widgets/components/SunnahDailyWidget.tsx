import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface SunnahDailyWidgetProps {
  title: string;
  detail: string;
  reference: string;
}

export const SunnahDailyWidget: React.FC<SunnahDailyWidgetProps> = ({
  title,
  detail,
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
        {/* Header */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
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
              text={String.fromCharCode(0xe838)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#10b981',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget allowFontScaling={false}
            text="DAILY SUNNAH"
            style={{
              color: '#10b981',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        <TextWidget allowFontScaling={false}
          text={title}
          style={{
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 'bold',
            marginTop: 4,
            width: 'match_parent',
          }}
        />

        <TextWidget allowFontScaling={false}
          text={detail}
          style={{
            color: '#9ca3af',
            fontSize: 12,
            marginTop: 6,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Sunni Reference */}
      <TextWidget allowFontScaling={false}
        text={`Ref: ${reference}`}
        style={{
          color: '#3b82f6',
          fontSize: 11,
          fontWeight: 'bold',
          width: 'match_parent',
        }}
      />
    </FlexWidget>
  );
};
