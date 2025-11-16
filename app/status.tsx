import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, MoreVertical, Search } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface StatusUpdate {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  time: string;
  isViewed: boolean;
}

interface MyStatus {
  id: string;
  time: string;
  views: number;
}

const StatusScreen = () => {
  const router = useRouter();
  const path = usePathname();

  const [myStatus] = useState<MyStatus>({
    id: '1',
    time: 'Just now',
    views: 32,
  });

  // NEW: store user's status image
  const [myStatusImage, setMyStatusImage] = useState<string | null>(null);

  // NEW: pick from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return alert("Permission to access gallery is required!");
  
      const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'images',
          quality: 0.5,
      });

    if (!result.canceled) {
      setMyStatusImage(result.assets[0].uri);
    }
  };

  const [recentUpdates] = useState<StatusUpdate[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Monique starrrr',
      avatar: 'https://i.pinimg.com/originals/68/d4/6d/68d46d54aac4b6315415ffed5437c3e3.jpg',
      time: '23 minutes ago',
      isViewed: false,
    },
    {
      id: '2',
      userId: '2',
      userName: 'Tata Fatou',
      avatar: 'https://media.istockphoto.com/id/1392583398/photo/portrait-40-year-old-black-african-woman.jpg?s=1024x1024&w=is&k=20&c=7Pz4ovPlix-OqxdIJEQDx8gM3ChWTgR6sq2AN1ooh9M=',
      time: '1 hour ago',
      isViewed: true,
    },
    {
      id: '3',
      userId: '3',
      userName: 'Adjzeuuuu',
      avatar: 'https://i.pinimg.com/736x/c8/ff/2a/c8ff2a91bbed8fd69db6a0946f89cd45.jpg',
      time: '3 hours ago',
      isViewed: false,
    },
    {
      id: '4',
      userId: '4',
      userName: 'Amina',
      avatar: 'https://i.pinimg.com/originals/8d/31/58/8d31584b0cab055f2c7a9d04fc461d32.jpg',
      time: '5 hours ago',
      isViewed: true,
    },
    {
      id: '5',
      userId: '5',
      userName: 'Tima',
      avatar: 'https://i.pinimg.com/originals/c9/49/0b/c9490b02e0d6ce748b57f48803760081.png',
      time: 'Yesterday',
      isViewed: false,
    },
    {
      id: '6',
      userId: '6',
      userName: 'Sophia Williams',
      avatar: 'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0',
      time: 'Yesterday',
      isViewed: true,
    },
  ]);

  const topTabs = [
    { name: 'Chats', route: '/' },
    { name: 'Status', route: '/status' },
    { name: 'Calls', route: '/call-history' },
  ];

  return (
    <View style={styles.container}>

      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {topTabs.map(tab => (
          <TouchableOpacity 
            key={tab.name} 
            onPress={() => router.push(tab.route as "/" | "/status" | "/call-history")}
          >
            <Text style={path === tab.route ? styles.activeTab : styles.inactiveTab}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={styles.headerTitle}>Status</Text>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginRight: 16 }}>
              <Search size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreVertical size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>

        {/* My Status */}
        <View style={{ backgroundColor: 'white', padding: 16, marginTop: 2 }}>
          <Text style={{ color: '#6b7280', fontWeight: '600', marginBottom: 8 }}>My Status</Text>

          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={pickImage}
          >
            <View style={{ position: 'relative' }}>
              <Image
                source={{
                  uri: myStatusImage 
                    ? myStatusImage
                    : 'https://i.pinimg.com/736x/01/a5/1e/01a51e0fa16a202b7bad39cdb73cd9b8.jpg'
                }}
                style={{ width: 56, height: 56, borderRadius: 28 }}
              />

              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#10B981',
                borderRadius: 50,
                padding: 2,
                borderWidth: 2,
                borderColor: 'white'
              }}>
                <Camera size={16} color="white" />
              </View>
            </View>

            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontWeight: '600', color: '#111' }}>My Status</Text>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>{myStatus.time}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Updates */}
        <View style={{ backgroundColor: 'white', padding: 16, marginTop: 8 }}>
          <Text style={{ color: '#6b7280', fontWeight: '600', marginBottom: 8 }}>Recent updates</Text>

          {recentUpdates.map(status => (
            <TouchableOpacity key={status.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: status.avatar }}
                  style={{ width: 56, height: 56, borderRadius: 28 }}
                />

                {!status.isViewed && (
                  <View style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 28,
                    borderWidth: 2,
                    borderColor: '#10B981'
                  }} />
                )}
              </View>

              <View style={{ marginLeft: 16 }}>
                <Text style={{ fontWeight: '600', color: '#111' }}>{status.userName}</Text>
                <Text style={{ color: '#6b7280', fontSize: 12 }}>{status.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Status Privacy Notice */}
        <View style={{ padding: 16, marginTop: 8 }}>
          <Text style={{ color: '#6b7280', fontSize: 12, textAlign: 'center' }}>
            Your status updates will disappear after 24 hours
          </Text>
        </View>
      </ScrollView>

      {/* Floating Action Button (opens gallery) */}
      <TouchableOpacity
        onPress={pickImage}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: '#10B981',
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 }
        }}
      >
        <Camera size={24} color="white" />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  topTabs: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 50, paddingBottom: 10, backgroundColor: '#10B981' },
  activeTab: { color: '#fff', fontWeight: 'bold', fontSize: 16, borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 5 },
  inactiveTab: { color: '#e5e5e5', fontSize: 16, paddingBottom: 5 },
  header: { backgroundColor: '#10B981', paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 8 },
});

export default StatusScreen;
