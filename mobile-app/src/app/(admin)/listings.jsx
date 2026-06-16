import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Plus, MapPin } from 'lucide-react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../../components/Header';
import PhotoUpload from '../../components/PhotoUpload';
import { useApp } from '../../context/AppContext';
import { SEVERITY } from '../../data/mockData';
import { COLORS, SIZES, globalStyles } from '../../theme';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1558640476-437a2b9438a2?auto=format&fit=crop&w=600&q=60';

const parseTime = (timeStr) => {
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(parseInt(h, 10));
  d.setMinutes(parseInt(m, 10));
  return d;
};

const formatTime = (dateObj) => {
  return `${dateObj.getHours().toString().padStart(2, '0')}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
};

const getTodayStr = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export default function AdminListings() {
  const { listings, addListing } = useApp();
  const [open, setOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [form, setForm] = useState({
    title: '',
    address: '',
    severity: 'medium',
    sizeAcres: '1',
    eventDate: getTodayStr(),
    startTime: '09:00',
    endTime: '12:00',
    capacity: '15',
    estimatedHours: '2',
    ageRequirement: '18+',
    photoURL: null
  });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const publish = () => {
    addListing({
      ...form,
      sizeAcres: Number(form.sizeAcres),
      estimatedHours: Number(form.estimatedHours),
      capacity: Number(form.capacity),
      photoURL: form.photoURL || PLACEHOLDER
    });
    setOpen(false);
    setForm((f) => ({ ...f, title: '', address: '', photoURL: null }));
  };

  return (
    <View style={globalStyles.container}>
      <Header
        title="Listings"
        sub="Manage cleanup hot spots"
        right={
          <TouchableOpacity style={styles.iconBtn} onPress={() => setOpen((o) => !o)}>
            <Plus size={22} color={COLORS.text} />
          </TouchableOpacity>
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        {open && (
          <View style={globalStyles.card}>
            <Text style={[globalStyles.boldText, { fontSize: 17 }]}>New hot spot</Text>
            
            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                value={form.title}
                onChangeText={(text) => setField('title', text)}
                placeholder="e.g. Riverside Trail Cleanup"
                placeholderTextColor={COLORS.textDim}
              />
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                value={form.address}
                onChangeText={(text) => setField('address', text)}
                placeholder="Street, City, State"
                placeholderTextColor={COLORS.textDim}
              />
            </View>

            <View style={{ marginTop: 12 }}>
              <PhotoUpload label="Photo of the area" value={form.photoURL} onChange={(d) => setField('photoURL', d)} />
            </View>

            <View style={[globalStyles.row, { gap: 12, marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Severity</Text>
                <View style={styles.rowButtons}>
                  {['low', 'medium', 'high'].map(sev => (
                    <TouchableOpacity 
                      key={sev}
                      style={[styles.radioBtn, form.severity === sev && styles.radioBtnActive]}
                      onPress={() => setField('severity', sev)}
                    >
                      <Text style={[styles.radioText, form.severity === sev && styles.radioTextActive]}>{sev}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Size (acres)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.sizeAcres}
                  onChangeText={(text) => setField('sizeAcres', text)}
                />
              </View>
            </View>

            <View style={[globalStyles.row, { gap: 12, marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Estimated Hours</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.estimatedHours}
                  onChangeText={(text) => setField('estimatedHours', text)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Age requirement</Text>
                <TextInput
                  style={styles.input}
                  value={form.ageRequirement}
                  onChangeText={(text) => setField('ageRequirement', text)}
                  placeholder="e.g. 18+"
                  placeholderTextColor={COLORS.textDim}
                />
              </View>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={styles.label}>Event date</Text>
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: COLORS.text, fontSize: 15 }}>{form.eventDate}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                display="spinner"
                customCancelButtonIOS={() => <View />}
                pickerContainerStyleIOS={{ justifyContent: 'center', alignItems: 'center' }}
                style={{ alignSelf: 'center' }}
                date={(() => {
                  const [y, m, d] = form.eventDate.split('-');
                  return new Date(y, m - 1, d);
                })()}
                onConfirm={(date) => {
                  setShowDatePicker(false);
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, '0');
                  const d = String(date.getDate()).padStart(2, '0');
                  setField('eventDate', `${y}-${m}-${d}`);
                }}
                onCancel={() => setShowDatePicker(false)}
              />
            </View>

            <View style={[globalStyles.row, { gap: 12, marginTop: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Start</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowStartTimePicker(true)}>
                  <Text style={{ color: COLORS.text, fontSize: 15 }}>{form.startTime}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showStartTimePicker}
                  mode="time"
                  display="spinner"
                  customCancelButtonIOS={() => <View />}
                  pickerContainerStyleIOS={{ justifyContent: 'center', alignItems: 'center' }}
                  style={{ alignSelf: 'center' }}
                  date={parseTime(form.startTime)}
                  onConfirm={(date) => {
                    setShowStartTimePicker(false);
                    setField('startTime', formatTime(date));
                  }}
                  onCancel={() => setShowStartTimePicker(false)}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>End</Text>
                <TouchableOpacity style={styles.input} onPress={() => setShowEndTimePicker(true)}>
                  <Text style={{ color: COLORS.text, fontSize: 15 }}>{form.endTime}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={showEndTimePicker}
                  mode="time"
                  display="spinner"
                  customCancelButtonIOS={() => <View />}
                  pickerContainerStyleIOS={{ justifyContent: 'center', alignItems: 'center' }}
                  style={{ alignSelf: 'center' }}
                  date={parseTime(form.endTime)}
                  onConfirm={(date) => {
                    setShowEndTimePicker(false);
                    setField('endTime', formatTime(date));
                  }}
                  onCancel={() => setShowEndTimePicker(false)}
                />
              </View>
              <View style={{ width: 80 }}>
                <Text style={styles.label}>Cap</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={form.capacity}
                  onChangeText={(text) => setField('capacity', text)}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity
                style={[globalStyles.btn, globalStyles.btnOutline, { flex: 1 }]}
                onPress={() => setOpen(false)}
              >
                <Text style={globalStyles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[globalStyles.btn, globalStyles.btnPrimary, { flex: 2 }, (!form.title || !form.address) && globalStyles.btnDisabled]}
                disabled={!form.title || !form.address}
                onPress={publish}
              >
                <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Publish</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={[globalStyles.sectionTitle, { marginTop: open ? 8 : 22 }]}>
          {listings.length} active listings
        </Text>

        {listings.map((l) => {
          const sev = SEVERITY[l.severity] || SEVERITY['low'];
          let pillStyle = globalStyles.pillGreen;
          let pillTextStyle = globalStyles.pillTextGreen;
          if (sev.pill === 'orange') {
            pillStyle = globalStyles.pillOrange;
            pillTextStyle = globalStyles.pillTextOrange;
          } else if (sev.pill === 'red') {
            pillStyle = globalStyles.pillRed;
            pillTextStyle = globalStyles.pillTextRed;
          }

          return (
            <View key={l.id} style={[globalStyles.card, { padding: 0, overflow: 'hidden' }]}>
              <Image source={{ uri: l.photoURL }} style={styles.listingImage} />
              <View style={{ padding: 14 }}>
                <Text style={[globalStyles.boldText, { fontSize: 16 }]}>{l.title}</Text>
                <View style={[globalStyles.row, { marginTop: 4, marginBottom: 8 }]}>
                  <MapPin size={12} color={COLORS.textDim} />
                  <Text style={globalStyles.mutedText}>{l.address}</Text>
                </View>
                <View style={[globalStyles.row, { flexWrap: 'wrap', gap: 8 }]}>
                  <View style={[globalStyles.pill, pillStyle]}>
                    <Text style={[globalStyles.pillText, pillTextStyle]}>{sev.label}</Text>
                  </View>
                  <Text style={[globalStyles.faintText, { fontSize: 12 }]}>
                    {l.eventDate} · ~{l.estimatedHours}h
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    color: COLORS.textDim,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surface2,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  radioBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  radioBtnActive: {
    borderColor: COLORS.green,
    backgroundColor: COLORS.greenSoft,
  },
  radioText: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  radioTextActive: {
    color: COLORS.green,
  },
  listingImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.surface2,
  }
});
