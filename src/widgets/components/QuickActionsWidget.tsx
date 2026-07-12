import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export const QuickActionsWidget: React.FC = () => {
  return (
    <FlexWidget
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
      {/* Read Action */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: "dhikr://home" }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#1e1b4b',
          borderRadius: 14,
          marginHorizontal: 4,
          padding: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#312e81',
          borderWidth: 1,
        }}
      >
        <TextWidget allowFontScaling={false}
          text={String.fromCharCode(0xe865)}
          style={{
            fontFamily: 'MaterialIcons',
            color: '#ffffff',
            fontSize: 20,
            marginRight: 6,
          }}
        />
        <TextWidget allowFontScaling={false}
          text="READ"
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Search Button */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: "dhikr://search" }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#064e3b',
          borderRadius: 14,
          marginHorizontal: 4,
          padding: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#065f46',
          borderWidth: 1,
        }}
      >
        <TextWidget allowFontScaling={false}
          text={String.fromCharCode(0xe8b6)}
          style={{
            fontFamily: 'MaterialIcons',
            color: '#ffffff',
            fontSize: 20,
            marginRight: 6,
          }}
        />
        <TextWidget allowFontScaling={false}
          text="SEARCH"
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>

      {/* Bookmarks Button */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: "dhikr://bookmarks" }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#78350f',
          borderRadius: 14,
          marginHorizontal: 4,
          padding: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#92400e',
          borderWidth: 1,
        }}
      >
        <TextWidget allowFontScaling={false}
          text={String.fromCharCode(0xe866)}
          style={{
            fontFamily: 'MaterialIcons',
            color: '#ffffff',
            fontSize: 20,
            marginRight: 6,
          }}
        />
        <TextWidget allowFontScaling={false}
          text="BOOKMARKS"
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
