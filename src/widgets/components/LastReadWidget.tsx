import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface LastReadWidgetProps {
  surahName: string;
  ayahNumber: number;
  surahId?: number;
  hasHistory?: boolean;
  hasFolder?: boolean;
}

export const LastReadWidget: React.FC<LastReadWidgetProps> = ({
  surahName,
  ayahNumber,
  surahId,
  hasFolder = true,
}) => {
  const deepLinkUri = surahId ? `dhikr://surah?surahId=${surahId}&initialAyah=${ayahNumber}` : 'dhikr://home';

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
              backgroundColor: '#f59e0b20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 10,
            }}
          >
            <TextWidget allowFontScaling={false}
              text={String.fromCharCode(0xe866)}
              style={{
                fontFamily: 'MaterialIcons',
                color: '#f59e0b',
                fontSize: 22,
              }}
            />
          </FlexWidget>
          <FlexWidget style={{ flexDirection: 'column', flex: 1 }}>
            <TextWidget allowFontScaling={false}
              text="NO PRIMARY FOLDER"
              style={{
                color: '#f59e0b',
                fontSize: 11,
                fontWeight: 'bold',
              }}
            />
            <TextWidget allowFontScaling={false}
              text="Assign a Folder"
              style={{
                color: '#ffffff',
                fontSize: 14,
                fontWeight: 'bold',
                marginTop: 2,
              }}
            />
            <TextWidget allowFontScaling={false}
              text="Tap to select in Bookmarks"
              style={{
                color: '#9ca3af',
                fontSize: 11,
              }}
            />
          </FlexWidget>
        </FlexWidget>

        <FlexWidget
          style={{
            backgroundColor: '#2563eb',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#3b82f6',
            borderWidth: 1,
          }}
        >
          <TextWidget allowFontScaling={false}
            text="CHOOSE"
            style={{
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 'bold',
            }}
          />
        </FlexWidget>
      </FlexWidget>
    );
  }

  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri: deepLinkUri }}
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
      <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <FlexWidget
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: '#f59e0b20',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
          }}
        >
          <TextWidget allowFontScaling={false}
            text={String.fromCharCode(0xe865)}
            style={{
              fontFamily: 'MaterialIcons',
              color: '#f59e0b',
              fontSize: 22,
            }}
          />
        </FlexWidget>
        <FlexWidget style={{ flexDirection: 'column' }}>
          <TextWidget allowFontScaling={false}
            text="RESUME READING"
            style={{
              color: '#f59e0b',
              fontSize: 11,
              fontWeight: 'bold',
            }}
          />
          <TextWidget allowFontScaling={false}
            text={surahName}
            style={{
              color: '#ffffff',
              fontSize: 16,
              fontWeight: 'bold',
              marginTop: 2,
            }}
          />
          <TextWidget allowFontScaling={false}
            text={`Ayah ${ayahNumber}`}
            style={{
              color: '#9ca3af',
              fontSize: 12,
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Button to resume */}
      <FlexWidget
        style={{
          backgroundColor: '#2563eb',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#3b82f6',
          borderWidth: 1,
        }}
      >
        <TextWidget allowFontScaling={false}
          text="RESUME"
          style={{
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
