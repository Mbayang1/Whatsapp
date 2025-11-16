import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Phone, PhoneCall, PhoneMissed, MessageCircle } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';

interface Call {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration: string;
  date: string;
}

const CallHistoryScreen = () => {
  const router = useRouter();
  const path = usePathname();
  
  const [calls, setCalls] = useState<Call[]>([
    { id: '1', contactId: '1', contactName: 'Alex Johnson', contactAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900', type: 'incoming', timestamp: '10:30 AM', duration: '12:45', date: 'Today' },
    { id: '2', contactId: '2', contactName: 'Sarah Miller', contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900', type: 'outgoing', timestamp: '9:15 AM', duration: '5:22', date: 'Today' },
    { id: '3', contactId: '3', contactName: 'Michael Chen', contactAvatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900', type: 'missed', timestamp: 'Yesterday', duration: '', date: 'Yesterday' },
    { id: '4', contactId: '4', contactName: 'Emma Davis', contactAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900', type: 'incoming', timestamp: '2:30 PM', duration: '8:17', date: 'May 14' },
    { id: '5', contactId: '5', contactName: 'David Wilson', contactAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900', type: 'outgoing', timestamp: 'Mon', duration: '3:45', date: 'May 13' },
    { id: '6', contactId: '6', contactName: 'Olivia Brown', contactAvatar: 'https://images.unsplash.com/photo-1578445714074-946b536079aa?w=900', type: 'missed', timestamp: 'Apr 30', duration: '', date: 'Apr 30' },
    { id: '7', contactId: '7', contactName: 'James Taylor', contactAvatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900', type: 'incoming', timestamp: 'Apr 28', duration: '15:32', date: 'Apr 28' },
    { id: '8', contactId: '8', contactName: 'Sophia Martinez', contactAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900', type: 'outgoing', timestamp: 'Apr 25', duration: '7:18', date: 'Apr 25' },
  ]);

  const topTabs: { name: string; route: "/" | "/status" | "/call-history" }[] = [
  { name: 'Chats', route: '/' },
  { name: 'Status', route: '/status' },
  { name: 'Calls', route: '/call-history' },
];


  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming': return <PhoneCall size={18} color="#128C7E" />;
      case 'outgoing': return <Phone size={18} color="#128C7E" />;
      case 'missed': return <PhoneMissed size={18} color="#FF0000" />;
      default: return <Phone size={18} color="#128C7E" />;
    }
  };

  const getCallTypeText = (type: string) => {
    switch (type) {
      case 'incoming': return 'Incoming';
      case 'outgoing': return 'Outgoing';
      case 'missed': return 'Missed';
      default: return '';
    }
  };

  const formatDateGroup = (date: string) => (
    <View style={{ backgroundColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 16 }}>
      <Text style={{ color: '#6b7280', fontWeight: '500' }}>{date}</Text>
    </View>
  );

  const groupedCalls: Record<string, Call[]> = {};
  calls.forEach(call => {
    if (!groupedCalls[call.date]) groupedCalls[call.date] = [];
    groupedCalls[call.date].push(call);
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {topTabs.map(tab => (
          <TouchableOpacity key={tab.name} onPress={() => router.push(tab.route)}>
            <Text style={path === tab.route ? styles.activeTab : styles.inactiveTab}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Call History</Text>
          <TouchableOpacity onPress={() => router.push('/')} style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 50 }}>
            <Phone color="white" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Call List */}
      <ScrollView>
        {Object.entries(groupedCalls).map(([date, dateCalls]) => (
          <View key={date}>
            {formatDateGroup(date)}
            {dateCalls.map(call => (
              <View key={call.id} style={{ flexDirection: 'row', padding: 16, borderBottomWidth: 1, borderColor: '#f3f4f6', alignItems: 'center' }}>
                <Image source={{ uri: call.contactAvatar }} style={{ width: 48, height: 48, borderRadius: 24, marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: '600', color: '#111' }}>{call.contactName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    {getCallIcon(call.type)}
                    <Text style={{ marginLeft: 8, fontSize: 12, color: call.type === 'missed' ? '#FF0000' : '#6b7280' }}>
                      {getCallTypeText(call.type)} • {call.timestamp}
                    </Text>
                  </View>
                  {call.duration ? <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{call.duration}</Text> : null}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{ backgroundColor: '#d1fae5', padding: 8, borderRadius: 50, marginRight: 8 }}>
                    <PhoneCall size={18} color="#128C7E" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#dbeafe', padding: 8, borderRadius: 50 }}>
                    <MessageCircle size={18} color="#128C7E" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  topTabs: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 50, paddingBottom: 10, backgroundColor: '#10B981' },
  activeTab: { color: '#fff', fontWeight: 'bold', fontSize: 16, borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 5 },
  inactiveTab: { color: '#e5e5e5', fontSize: 16, paddingBottom: 5 },
  header: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
});

export default CallHistoryScreen;
