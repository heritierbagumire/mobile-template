import React from 'react';
import { View, Text } from 'react-native';

// This is just a placeholder for the tab navigator
// The actual functionality is in the tab button
export default function AddPlaceholderScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {/* Placeholder content can go here if needed */}
            <Text style={{ fontSize: 18, color: '#888' }}>
                This is a placeholder screen. Use the tab button to add a new transaction.
            </Text>
        </View>
    )
}