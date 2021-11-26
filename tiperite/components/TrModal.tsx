import { Pressable, Modal } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { BlurView } from 'expo-blur';
import React from 'react';

/**
 * A common modal component
 */
export function TrModal({
  children,
  onClose,
  visible,
}: {
  children: React.ReactChild;
  onClose: () => void;
  visible: boolean;
}): JSX.Element {
  const theme = useTheme('TrModal');

  return (
    <Modal
      onRequestClose={onClose}
      animationType="fade"
      transparent
      onDismiss={onClose}
      visible={visible}
    >
      <BlurView intensity={25} tint="dark" style={theme.BlurView}>
        <Pressable onPress={onClose} style={theme.Pressable}>
          {children}
        </Pressable>
      </BlurView>
    </Modal>
  );
}
