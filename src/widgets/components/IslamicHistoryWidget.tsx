import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface IslamicHistoryWidgetProps {
  topic: string;
  fact: string;
  reference: string;
}

export const IslamicHistoryWidget: React.FC<IslamicHistoryWidgetProps> = ({
  topic,
  fact,
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
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#1e293b',
        borderWidth: 1.5,
      }}
    >
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
        <FlexWidget
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: '#3b82f620',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <TextWidget
            text={String.fromCharCode(0xe8b6)}
            style={{
              fontFamily: 'MaterialIcons',
              color: '#3b82f6',
              fontSize: 22,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
          <TextWidget
            text={topic.toUpperCase()}
            style={{
              color: '#f59e0b',
              fontSize: 11,
              fontWeight: 'bold',
            }}
          />
          <TextWidget
            text={fact}
            style={{
              color: '#ffffff',
              fontSize: 12,
              marginTop: 2,
            }}
            
          />
        </FlexWidget>
      </FlexWidget>

      {/* Reference label */}
      <TextWidget
        text={`Ref: ${reference}`}
        style={{
          color: '#9ca3af',
          fontSize: 10,
          fontWeight: 'bold',
        }}
      />
    </FlexWidget>
  );
};
