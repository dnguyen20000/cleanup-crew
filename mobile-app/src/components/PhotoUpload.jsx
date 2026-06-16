import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../theme';

export default function PhotoUpload({ label, value, onChange }) {
  const handlePress = async () => {
    // Request permission (often automatically granted in dev, but good practice)
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6, // Compress
      base64: true, // We need base64 for the data URL equivalent
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      // Construct a data URL equivalent for compatibility with our Firebase logic
      const dataUrl = `data:image/jpeg;base64,${asset.base64}`;
      onChange(dataUrl);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handlePress} activeOpacity={0.8}>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <>
            <Camera size={26} color={COLORS.textDim} />
            <Text style={styles.placeholderText}>Tap to add photo</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: COLORS.textDim,
    marginBottom: 5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 14,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  placeholderText: {
    color: COLORS.textDim,
    fontSize: 13,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
});
