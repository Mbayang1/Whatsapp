import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search, Phone, MoreVertical } from "lucide-react-native";
import { useLocalSearchParams } from 'expo-router';
 // Now you know which chat to show


// Types
interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastSeen?: string;
}

interface Chat {
  id: string;
  userId: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900", status: "Online" },
  { id: "2", name: "Sarah Miller", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900", status: "Offline", lastSeen: "2 hours ago" },
  { id: "3", name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900", status: "Online" },
];

const mockChats: Chat[] = [
  { id: "1", userId: "1", lastMessage: "Hey there!", timestamp: "10:30 AM", unreadCount: 0 },
  { id: "2", userId: "2", lastMessage: "Meeting at 3 PM", timestamp: "9:20 AM", unreadCount: 2 },
  { id: "3", userId: "3", lastMessage: "Did you check?", timestamp: "Yesterday", unreadCount: 0 },
];

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const { userId } = useLocalSearchParams();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedChats = await AsyncStorage.getItem("chats");
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedChats) setChats(JSON.parse(storedChats));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredChats = chats.filter(chat => {
    const user = users.find(u => u.id === chat.userId);
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderItem = ({ item }: { item: Chat }) => {
    const user = users.find(u => u.id === item.userId);
    if (!user) return null;
    return (
      <TouchableOpacity style={styles.chatItem}>
  <Image source={{ uri: user.avatar }} style={styles.avatar} />
  <View style={styles.chatText}>
    <View style={styles.chatHeader}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
    <Text style={item.unreadCount > 0 ? styles.lastMessageUnread : styles.lastMessage}>
      {item.lastMessage}
    </Text>
  </View>
  {item.unreadCount > 0 && (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadText}>{item.unreadCount}</Text>
    </View>
  )}
</TouchableOpacity>

    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 10 }}>
            <Phone size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreVertical size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.chatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { backgroundColor: "#10B981", paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  headerIcons: { position: "absolute", right: 16, top: 50, flexDirection: "row" },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", padding: 8, borderRadius: 8, marginTop: 16, alignItems: "center" },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  chatList: { flex: 1 },
  chatItem: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 0.5, borderColor: "#ccc" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  chatText: { flex: 1 },
  chatHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  name: { fontWeight: "bold", fontSize: 16 },
  timestamp: { fontSize: 12, color: "#6B7280" },
  lastMessage: { fontSize: 14, color: "#6B7280" },
  lastMessageUnread: { fontSize: 14, fontWeight: "bold", color: "#111" },
  unreadBadge: { backgroundColor: "#10B981", borderRadius: 12, width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  unreadText: { color: "#fff", fontWeight: "bold" },
});
