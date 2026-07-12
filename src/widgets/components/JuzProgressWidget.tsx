import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface JuzProgressWidgetProps {
  juzNumber: number;
  progressPercent: number;
  versesRead: number;
  totalVerses: number;
  hasFolder?: boolean;
}

export const JuzProgressWidget: React.FC<JuzProgressWidgetProps> = ({
  juzNumber,
  progressPercent,
  versesRead,
  totalVerses,
  hasFolder = true,
}) => {
  if (!hasFolder) {
    return (
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: "dhikr://bookmarks" }}
        style={{
          height: 'match_parent',
          width: 'match_parent',
          backgroundColor: '#090d16',
          borderRadius: 24,
          padding: 14,
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderColor: '#1e293b',
          borderWidth: 1.5,
        }}
      >
        <FlexWidget
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: 'match_parent',
          }}
        >
          <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FlexWidget
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: '#3b82f620',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <TextWidget allowFontScaling={false}
                text={String.fromCharCode(0xe866)}
                style={{
                  fontFamily: 'MaterialIcons',
                  color: '#3b82f6',
                  fontSize: 18,
                }}
              />
            </FlexWidget>
            <TextWidget allowFontScaling={false}
              text="JUZ PROGRESS"
              style={{
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 'bold',
              }}
            />
          </FlexWidget>

          <TextWidget allowFontScaling={false}
            text="Tap to choose folder"
            style={{
              color: '#f59e0b',
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        {/* Progress track */}
        <FlexWidget
          style={{
            width: 'match_parent',
            height: 8,
            backgroundColor: '#1f2937',
            borderRadius: 4,
            flexDirection: 'row',
            marginTop: 6,
          }}
        >
          <FlexWidget
            style={{
              flex: 5,
              height: 'match_parent',
              backgroundColor: '#374151',
              borderRadius: 4,
            }}
          />
          <FlexWidget
            style={{
              flex: 95,
              height: 'match_parent',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    );
  }

  const pct = Math.max(5, Math.min(100, Math.round(progressPercent)));
  
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#090d16',
        borderRadius: 24,
        padding: 14,
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderColor: '#1e293b',
        borderWidth: 1.5,
      }}
    >
      <FlexWidget
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 'match_parent',
        }}
      >
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FlexWidget
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: '#3b82f620',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
            }}
          >
            <TextWidget allowFontScaling={false}
              text={String.fromCharCode(0xe866)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#3b82f6',
                fontSize: 18,
              }}
            />
          </FlexWidget>
          <TextWidget allowFontScaling={false}
            text={`JUZ ${juzNumber} PROGRESS`}
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>

        <TextWidget allowFontScaling={false}
          text={`${pct}% (${versesRead}/${totalVerses})`}
          style={{
            color: '#f59e0b',
            fontSize: 12,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Progress track */}
      <FlexWidget
        style={{
          width: 'match_parent',
          height: 8,
          backgroundColor: '#1f2937',
          borderRadius: 4,
          flexDirection: 'row',
          marginTop: 6,
        }}
      >
        <FlexWidget
          style={{
            flex: pct,
            height: 'match_parent',
            backgroundColor: '#f59e0b',
            borderRadius: 4,
          }}
        />
        {pct < 100 && (
          <FlexWidget
            style={{
              flex: 100 - pct,
              height: 'match_parent',
            }}
          />
        )}
      </FlexWidget>
    </FlexWidget>
  );
};
