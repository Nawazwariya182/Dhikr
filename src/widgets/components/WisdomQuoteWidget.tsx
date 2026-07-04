import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface WisdomQuoteWidgetProps {
  quote: string;
  author: string;
}

export const WisdomQuoteWidget: React.FC<WisdomQuoteWidgetProps> = ({
  quote,
  author,
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
          borderBottomWidth: 1.5,
          borderBottomColor: '#1f2937',
          paddingBottom: 6,
          marginBottom: 8,
        }}
      >
        <TextWidget
          text="💭 Islamic Wisdom"
          style={{
            color: '#f59e0b',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Quote text block */}
      <FlexWidget
        style={{
          flex: 1.2,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 4,
          paddingVertical: 6,
        }}
      >
        <TextWidget
          text={`"${quote}"`}
          style={{
            color: '#ffffff',
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}
        />
      </FlexWidget>

      {/* Author reference */}
      <FlexWidget
        style={{
          alignItems: 'flex-end',
          width: 'match_parent',
          marginTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#1f293722',
          paddingTop: 4,
        }}
      >
        <TextWidget
          text={`— ${author}`}
          style={{
            color: '#9ca3af',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
