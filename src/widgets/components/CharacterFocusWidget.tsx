import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface CharacterFocusWidgetProps {
  topic: string;
  action: string;
}

export const CharacterFocusWidget: React.FC<CharacterFocusWidgetProps> = ({
  topic,
  action,
}) => {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#090d16',
        borderRadius: 24,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#1e293b',
        borderWidth: 1.5,
      }}
    >
      <FlexWidget
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          backgroundColor: '#10b98120',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        <TextWidget allowFontScaling={false}
          text={String.fromCharCode(0xe8b5)}
          style={{
            fontFamily: 'MaterialIcons',
            color: '#10b981',
            fontSize: 22,
          }}
        />
      </FlexWidget>

      <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
        <TextWidget allowFontScaling={false}
          text={`AKHLAQ: ${topic.toUpperCase()}`}
          style={{
            color: '#10b981',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
        <TextWidget allowFontScaling={false}
          text={action}
          style={{
            color: '#ffffff',
            fontSize: 12,
            marginTop: 2,
            width: 'match_parent',
          }}
          
        />
      </FlexWidget>
    </FlexWidget>
  );
};
