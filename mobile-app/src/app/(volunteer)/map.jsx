import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { ChevronLeft, MapPin, Calendar, Clock, Shield, Users, X, UserCheck } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useApp } from '../../context/AppContext';
import { SEVERITY } from '../../data/mockData';
import { COLORS, SIZES, globalStyles } from '../../theme';

function distanceMiles(loc1, loc2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MapScreen() {
  const { user, listings, signups, signUpForEvent } = useApp();
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const homeLocation = { lat: 33.95, lng: -84.34 }; // Fallback
  const sorted = useMemo(
    () =>
      [...listings]
        .map((l) => ({ ...l, dist: distanceMiles(homeLocation, l.location) }))
        .sort((a, b) => a.dist - b.dist),
    [listings]
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: homeLocation.lat,
          longitude: homeLocation.lng,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        userInterfaceStyle="dark"
      >
        {sorted.map((item) => {
          const sev = SEVERITY[item.severity];
          return (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.location.lat, longitude: item.location.lng }}
              onPress={() => setSelected(item)}
            >
              <View style={[styles.markerBody, selected?.id === item.id && styles.markerBodySelected, { backgroundColor: selected?.id === item.id ? COLORS.green : sev.color }]}>
                <Text style={[styles.markerText, selected?.id === item.id && { color: '#06150f' }]}>{item.dist.toFixed(1)}m</Text>
              </View>
              <View style={[styles.markerTriangle, { borderTopColor: selected?.id === item.id ? COLORS.green : sev.color }]} />
            </Marker>
          );
        })}
      </MapView>

      {/* SlideUpModal equivalent */}
      <Modal visible={!!selected} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={styles.modalContainer} onStartShouldSetResponder={() => true}>
            {selected && (() => {
              const sev = SEVERITY[selected.severity];
              const already = signups.some((s) => s.listingId === selected.id);
              const full = selected.signupCount >= selected.capacity;

              return (
                <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 0 }}>
                  <Image source={{ uri: selected.photoURL }} style={styles.modalImage} />
                  
                  <TouchableOpacity style={styles.closeX} onPress={() => setSelected(null)}>
                    <X size={20} color="#fff" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.modalClose} onPress={() => setSelected(null)}>
                    <View style={styles.modalGrab} />
                  </TouchableOpacity>

                <View style={{ padding: 20 }}>
                  <View style={[globalStyles.row, globalStyles.between, { marginBottom: 6 }]}>
                    <View style={[globalStyles.pill, sev.pill === 'red' ? globalStyles.pillRed : sev.pill === 'orange' ? globalStyles.pillOrange : globalStyles.pillGreen]}>
                      <Text style={[globalStyles.pillText, sev.pill === 'red' ? globalStyles.pillTextRed : sev.pill === 'orange' ? globalStyles.pillTextOrange : globalStyles.pillTextGreen]}>{sev.label} hot spot</Text>
                    </View>
                    <View style={[globalStyles.pill, globalStyles.pillBlue]}>
                      <Text style={[globalStyles.pillText, globalStyles.pillTextBlue]}>
                        {selected.signupCount}/{selected.capacity} joined
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalTitle}>{selected.title}</Text>

                  <View style={styles.infoRow}>
                    <MapPin size={18} color={COLORS.textDim} />
                    <Text style={styles.infoText}>{selected.address}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Calendar size={18} color={COLORS.textDim} />
                    <Text style={styles.infoText}>
                      {selected.eventDate} · {selected.startTime}–{selected.endTime}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Clock size={18} color={COLORS.textDim} />
                    <Text style={styles.infoText}>Est. {selected.estimatedHours} hrs</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Shield size={18} color={COLORS.textDim} />
                    <Text style={styles.infoText}>Hosted by {selected.adminName}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <UserCheck size={18} color={COLORS.textDim} />
                    <Text style={styles.infoText}>Age requirement: {selected.ageRequirement || '18+'}</Text>
                  </View>

                  <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <Users size={18} color={COLORS.textDim} />
                    <Text style={[styles.infoText, { color: COLORS.textDim }]}>Earn ~{Math.round(selected.estimatedHours * 50)} points + verified hours</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      globalStyles.btn,
                      already ? globalStyles.btnOutline : globalStyles.btnPrimary,
                      { marginTop: 14 },
                      (already || full) && !already && { opacity: 0.5 }
                    ]}
                    disabled={already || full}
                    onPress={() => {
                      signUpForEvent(selected);
                      setSelected(null);
                      Toast.show({
                        type: 'success',
                        text1: 'Signed up!',
                        text2: `You are now registered for ${selected.title}.`,
                        position: 'bottom',
                        bottomOffset: 110,
                      });
                    }}
                  >
                    <Text style={[globalStyles.btnText, already ? { color: COLORS.text } : globalStyles.btnPrimaryText]}>
                      {already ? 'Already signed up' : full ? 'Event full' : 'Sign up to volunteer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            );
          })()}
          </View>
        </TouchableOpacity>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  map: {
    flex: 1,
  },
  markerBody: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
  },
  markerBodySelected: {
    borderColor: COLORS.greenSoft,
  },
  markerText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '90%',
    backgroundColor: COLORS.bg,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
    overflow: 'hidden',
    paddingBottom: 40,
  },
  modalImage: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.surface2,
  },
  closeX: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  modalGrab: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 3,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.text,
  },
});
