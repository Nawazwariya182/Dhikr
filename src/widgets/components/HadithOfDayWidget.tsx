import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface HadithOfDayWidgetProps {
  text: string;
  reference: string;
  grading: string;
}

export const HadithOfDayWidget: React.FC<HadithOfDayWidgetProps> = ({
  text,
  reference,
  grading,
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
              text={String.fromCharCode(0xe865)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#f59e0b',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget
            text="HADITH OF THE DAY"
            style={{
              color: '#f59e0b',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Hadith Content */}
        <TextWidget
          text={text}
          style={{
            color: '#ffffff',
            fontSize: 13,
            marginTop: 6,
            width: 'match_parent',
          }}
        />
      </FlexWidget>

      {/* Footer References */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
          marginTop: 8,
        }}
      >
        <TextWidget
          text={`Grading: ${grading}`}
          style={{
            color: '#10b981',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
        <TextWidget
          text={`- ${reference}`}
          style={{
            color: '#3b82f6',
            fontSize: 11,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
