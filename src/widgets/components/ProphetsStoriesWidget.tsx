import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface ProphetsStoriesWidgetProps {
  prophet: string;
  snippet: string;
  lesson: string;
}

export const ProphetsStoriesWidget: React.FC<ProphetsStoriesWidgetProps> = ({
  prophet,
  snippet,
  lesson,
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
              text={String.fromCharCode(0xe838)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#f59e0b',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget
            text={(prophet || '').toUpperCase()}
            style={{
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 'bold',
              width: 'match_parent',
            }}
          />
        </FlexWidget>

        {/* Snippet */}
        <TextWidget
          text={snippet}
          style={{
            color: '#ffffff',
            fontSize: 13,
            marginTop: 4,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Lesson */}
      <TextWidget
        text={`Lesson: ${lesson}`}
        style={{
          color: '#10b981',
          fontSize: 11,
          fontWeight: 'bold',
          width: 'match_parent',
          marginTop: 6,
        }}
      />
    </FlexWidget>
  );
};
