import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal } from 'react-native';
import { MapPin, Clock, Info, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react-native';
import Header from '../../components/Header';
import PhotoUpload from '../../components/PhotoUpload';
import CompletionSummary from '../../components/CompletionSummary';
import { useApp } from '../../context/AppContext';
import { COLORS, SIZES, globalStyles } from '../../theme';

// Helper to generate the days in a month grid
const generateMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const grid = [];
  let week = [];

  // Fill prev month days
  for (let i = firstDay - 1; i >= 0; i--) {
    week.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }

  // Fill current month
  for (let d = 1; d <= daysInMonth; d++) {
    week.push({ day: d, isCurrentMonth: true });
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }

  // Fill next month
  if (week.length > 0) {
    let d = 1;
    while (week.length < 7) {
      week.push({ day: d++, isCurrentMonth: false });
    }
    grid.push(week);
  }

  return grid;
};

export default function Calendar() {
  const { user, listings, signups, signUpForEvent, cancelSignup, checkIn, setPhoto, submitForReview } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // Default to June 2026
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const todayDateObj = new Date(2026, 5, 13); // Assume June 13, 2026 as per mock data
  const isTodayMonth = todayDateObj.getFullYear() === currentYear && todayDateObj.getMonth() === currentMonth;
  const today = isTodayMonth ? todayDateObj.getDate() : -1; 

  const monthGrid = useMemo(() => generateMonthGrid(currentYear, currentMonth), [currentYear, currentMonth]);
  const mySignups = useMemo(() => signups.filter((s) => s.uid === user?.uid), [signups, user]);
  const datesWithEvents = useMemo(() => new Set(mySignups.map((s) => s.eventDate)), [mySignups]);

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null); // String like "2026-06-13"
  const [completedSignup, setCompletedSignup] = useState(null); // For summary modal

  // When a week is tapped
  const handleWeekPress = (week) => {
    setSelectedWeek(week);
  };

  const handleDayPress = (dayObj) => {
    if (!dayObj.isCurrentMonth) return;
    const mStr = String(currentMonth + 1).padStart(2, '0');
    const dateStr = `${currentYear}-${mStr}-${dayObj.day.toString().padStart(2, '0')}`;
    setSelectedDate(dateStr);
  };

  // Find listings to display
  const displayListings = useMemo(() => {
    if (selectedDate) {
      return listings.filter(l => l.eventDate === selectedDate);
    }
    if (selectedWeek) {
      const weekDates = selectedWeek
        .filter(d => d.isCurrentMonth)
        .map(d => {
           const mStr = String(currentMonth + 1).padStart(2, '0');
           return `${currentYear}-${mStr}-${d.day.toString().padStart(2, '0')}`;
        });
      return listings.filter(l => weekDates.includes(l.eventDate));
    }
    return [];
  }, [listings, selectedDate, selectedWeek, currentYear, currentMonth]);

  return (
    <View style={globalStyles.container}>
      <Header title="Calendar" sub="Plan your volunteer schedule" />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={globalStyles.screen}>
        
        {/* Month Navigation */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
          <TouchableOpacity onPress={() => { setCurrentDate(new Date(currentYear, currentMonth - 1, 1)); setSelectedWeek(null); setSelectedDate(null); }}>
            <ChevronLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: COLORS.text }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => { setCurrentDate(new Date(currentYear, currentMonth + 1, 1)); setSelectedWeek(null); setSelectedDate(null); }}>
            <ChevronRight size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Days of week header */}
        <View style={styles.daysHeader}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
            <Text key={d} style={styles.dayHeaderText}>{d}</Text>
          ))}
        </View>

        {/* Month Grid */}
        <View style={styles.monthGrid}>
          {monthGrid.map((week, wIdx) => (
            <TouchableOpacity 
              key={wIdx} 
              style={[styles.weekRow, selectedWeek === week && styles.weekRowSelected]} 
              onPress={() => handleWeekPress(week)}
              activeOpacity={0.7}
            >
              {week.map((dayObj, dIdx) => {
                const isToday = dayObj.isCurrentMonth && dayObj.day === today;
                const mStr = String(currentMonth + 1).padStart(2, '0');
                const dateStr = dayObj.isCurrentMonth ? `${currentYear}-${mStr}-${dayObj.day.toString().padStart(2, '0')}` : null;
                const hasEvent = dateStr && datesWithEvents.has(dateStr);
                return (
                  <View key={dIdx} style={[styles.dayCell, isToday && styles.todayCell]}>
                    <Text style={[
                      styles.dayText, 
                      !dayObj.isCurrentMonth && styles.dayTextDim,
                      isToday && styles.todayText
                    ]}>
                      {dayObj.day}
                    </Text>
                    {hasEvent && <View style={[styles.eventDot, isToday && { backgroundColor: '#06150f' }]} />}
                  </View>
                );
              })}
            </TouchableOpacity>
          ))}
        </View>

        {/* Guide Text */}
        {!selectedWeek && (
          <View style={styles.guide}>
            <Text style={styles.guideText}>Tap a week to view events</Text>
          </View>
        )}
      </ScrollView>

      {/* Week Modal */}
      <Modal visible={!!selectedWeek} animationType="slide" presentationStyle="formSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Week View</Text>
            <TouchableOpacity onPress={() => { setSelectedWeek(null); setSelectedDate(null); }}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Week Strip */}
          <View style={styles.weekStrip}>
            {selectedWeek?.map((dayObj, dIdx) => {
              const mStr = String(currentMonth + 1).padStart(2, '0');
              const dateStr = dayObj.isCurrentMonth ? `${currentYear}-${mStr}-${dayObj.day.toString().padStart(2, '0')}` : null;
              const isSelected = dateStr !== null && selectedDate === dateStr;
              const hasEvent = dateStr && datesWithEvents.has(dateStr);
              return (
                <TouchableOpacity 
                  key={dIdx} 
                  style={[styles.stripDay, isSelected && styles.stripDaySelected]}
                  onPress={() => handleDayPress(dayObj)}
                  disabled={!dayObj.isCurrentMonth}
                >
                  <Text style={[styles.stripDayText, !dayObj.isCurrentMonth && styles.dayTextDim, isSelected && styles.stripDayTextSelected]}>
                    {dayObj.day}
                  </Text>
                  {hasEvent && (
                    <View style={[styles.eventDot, isSelected && { backgroundColor: '#06150f' }, { bottom: 4 }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            {displayListings.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>
                  {selectedDate ? "No events scheduled for this day." : "No events scheduled for this week."}
                </Text>
              </View>
            ) : (
              displayListings.map(listing => {
                const signup = signups.find(s => s.listingId === listing.id && s.uid === user.uid);
                
                return (
                  <View key={listing.id} style={globalStyles.card}>
                    <Text style={[globalStyles.sectionTitle, { marginTop: 0 }]}>{listing.title}</Text>
                    <View style={globalStyles.row}>
                      <Clock size={16} color={COLORS.textDim} />
                      <Text style={globalStyles.mutedText}>{listing.startTime} - {listing.endTime}</Text>
                    </View>
                    <View style={[globalStyles.row, { marginTop: 6 }]}>
                      <MapPin size={16} color={COLORS.textDim} />
                      <Text style={globalStyles.mutedText}>Atlanta, GA</Text>
                    </View>
                    <View style={[globalStyles.row, { marginTop: 6 }]}>
                      <UserCheck size={16} color={COLORS.textDim} />
                      <Text style={globalStyles.mutedText}>Age req: {listing.ageRequirement || '18+'}</Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={{ marginTop: 20 }}>
                      {!signup ? (
                        <TouchableOpacity style={[globalStyles.btn, globalStyles.btnPrimary]} onPress={() => signUpForEvent(listing)}>
                          <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Sign Up</Text>
                        </TouchableOpacity>
                      ) : signup.status === 'registered' ? (
                        <View style={{ gap: 18 }}>
                          <View style={[globalStyles.pill, globalStyles.pillBlue, { alignSelf: 'flex-start' }]}>
                            <Text style={[globalStyles.pillText, globalStyles.pillTextBlue]}>Registered</Text>
                          </View>
                          {!signup.checkedIn ? (
                            <TouchableOpacity style={[globalStyles.btn, globalStyles.btnOutline]} onPress={() => checkIn(signup.id)}>
                              <Text style={globalStyles.btnText}>Check In</Text>
                            </TouchableOpacity>
                          ) : (
                            <View style={{ gap: 16 }}>
                              <Text style={globalStyles.boldText}>Upload Proof</Text>
                              <View style={[globalStyles.row, { gap: 10 }]}>
                                <PhotoUpload 
                                  label="Before Photo" 
                                  value={signup.beforePhotoURL} 
                                  onChange={(url) => setPhoto(signup.id, 'before', url)} 
                                />
                                <PhotoUpload 
                                  label="After Photo" 
                                  value={signup.afterPhotoURL} 
                                  onChange={(url) => setPhoto(signup.id, 'after', url)} 
                                />
                              </View>
                              <TouchableOpacity 
                                style={[globalStyles.btn, globalStyles.btnPrimary, (!signup.beforePhotoURL || !signup.afterPhotoURL) && globalStyles.btnDisabled]} 
                                onPress={async () => {
                                  if (signup.beforePhotoURL && signup.afterPhotoURL) {
                                    let actualHours = listing.estimatedHours;
                                    if (signup.checkInTime) {
                                      const diffHrs = (Date.now() - signup.checkInTime) / (1000 * 60 * 60);
                                      actualHours = Number(Math.max(0.1, diffHrs).toFixed(1));
                                    }
                                    await submitForReview(signup.id, actualHours);
                                    setCompletedSignup({ ...signup, actualHours }); // Show summary
                                  }
                                }}
                                disabled={!signup.beforePhotoURL || !signup.afterPhotoURL}
                              >
                                <Text style={[globalStyles.btnText, globalStyles.btnPrimaryText]}>Complete Cleanup</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => cancelSignup(signup.id)}>
                            <Text style={[globalStyles.mutedText, { textAlign: 'center' }]}>Cancel Registration</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View style={[globalStyles.pill, signup.status === 'completed' ? globalStyles.pillGreen : globalStyles.pillOrange, { alignSelf: 'flex-start' }]}>
                          <Text style={[globalStyles.pillText, signup.status === 'completed' ? globalStyles.pillTextGreen : globalStyles.pillTextOrange]}>
                            {signup.status === 'completed' ? 'Completed' : 'In review'}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </Modal>

      <CompletionSummary signup={completedSignup} user={user} onClose={() => setCompletedSignup(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dayHeaderText: {
    color: COLORS.textDim,
    fontSize: 14,
    fontWeight: '700',
    width: 40,
    textAlign: 'center',
  },
  monthGrid: {
    gap: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
  },
  weekRowSelected: {
    backgroundColor: COLORS.surface2,
  },
  dayCell: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  todayCell: {
    backgroundColor: COLORS.green,
  },
  dayText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  dayTextDim: {
    color: COLORS.textFaint,
  },
  todayText: {
    color: '#06150f',
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.green,
    position: 'absolute',
    bottom: 3,
  },
  guide: {
    marginTop: 40,
    alignItems: 'center',
  },
  guideText: {
    color: COLORS.textDim,
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30, // For notch
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.green,
    fontWeight: '600',
  },
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  stripDay: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  stripDaySelected: {
    backgroundColor: COLORS.green,
  },
  stripDayText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  stripDayTextSelected: {
    color: '#06150f',
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: COLORS.textDim,
    fontSize: 16,
  },
});
