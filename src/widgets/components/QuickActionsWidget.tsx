import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export const QuickActionsWidget: React.FC = () => {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#030712',
        borderRadius: 16,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderColor: '#1f2937',
        borderWidth: 1.5,
      }}
    >
      {/* Last Read Button */}
      <FlexWidget
        clickAction="OPEN_URI"
        clickActionData={{ uri: 'dhikr://home' }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#111827',
          borderRadius: 10,
          marginHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#374151',
          borderWidth: 1.5,
        }}
      >
        <TextWidget
          text="📖 Read"
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
        clickActionData={{ uri: 'dhikr://search' }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#111827',
          borderRadius: 10,
          marginHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#374151',
          borderWidth: 1.5,
        }}
      >
        <TextWidget
          text="🔍 Search"
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
        clickActionData={{ uri: 'dhikr://bookmarks' }}
        style={{
          flex: 1,
          height: 'match_parent',
          backgroundColor: '#111827',
          borderRadius: 10,
          marginHorizontal: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#374151',
          borderWidth: 1.5,
        }}
      >
        <TextWidget
          text="🔖 Bookmarks"
          style={{
            color: '#ffffff',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
};
