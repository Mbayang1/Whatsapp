import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Search, Phone, MoreVertical } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

// Types
interface User { id: string; name: string; avatar: string; status: string; }
interface Chat { id: string; userId: string; lastMessage: string; timestamp: string; unreadCount: number; }

// Mock data
const mockUsers: User[] = [
  { id: "1", name: "Tima", avatar: "https://i.pinimg.com/originals/c9/49/0b/c9490b02e0d6ce748b57f48803760081.png", status: "Online" },
  { id: "2", name: "Amina", avatar: "https://i.pinimg.com/originals/8d/31/58/8d31584b0cab055f2c7a9d04fc461d32.jpg", status: "Offline" },
  { id: "3", name: "Tata Fatou", avatar: "https://media.istockphoto.com/id/1392583398/photo/portrait-40-year-old-black-african-woman.jpg?s=1024x1024&w=is&k=20&c=7Pz4ovPlix-OqxdIJEQDx8gM3ChWTgR6sq2AN1ooh9M=", status: "Online" },
  { id: "4", name: "Monique starrrr", avatar: "https://i.pinimg.com/originals/68/d4/6d/68d46d54aac4b6315415ffed5437c3e3.jpg", status: "Online" },
  { id: "5", name: "Adjzeuuuu", avatar: "https://i.pinimg.com/736x/c8/ff/2a/c8ff2a91bbed8fd69db6a0946f89cd45.jpg", status: "Offline" },
];


const mockChats: Chat[] = [
  { id: "1", userId: "1", lastMessage: "Mbaaa! Yangui Yves?", timestamp: "10:30 AM", unreadCount: 0 },
  { id: "2", userId: "2", lastMessage: "Meeting at 3 PM", timestamp: "9:20 AM", unreadCount: 2 },
  { id: "3", userId: "3", lastMessage: "Namnaala. Ani sa yaye?", timestamp: "Yesterday", unreadCount: 0 },
  { id: "4", userId: "4", lastMessage: "Paré gouma OOP. Paré nga?", timestamp: "Mon", unreadCount: 1 },
  { id: "5", userId: "5", lastMessage: "Dangay dem Thies?", timestamp: "Sun", unreadCount: 0 },
];

export default function ChatApp() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const path = usePathname();

  useEffect(() => { loadData(); }, []);
  const loadData = async () => {
    try {
      const storedChats = await AsyncStorage.getItem("chats");
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedChats) setChats(JSON.parse(storedChats));
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch (error) { console.log(error); }
  };

  const filteredChats = chats.filter(chat => {
    const user = users.find(u => u.id === chat.userId);
    return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const openChat = (userId: string) => { router.push(`/chat-detail?userId=${userId}` as const); };

  const renderItem = ({ item }: { item: Chat }) => {
    const user = users.find(u => u.id === item.userId); if (!user) return null;
    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => openChat(user.id)}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.chatText}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={item.unreadCount > 0 ? styles.lastMessageUnread : styles.lastMessage}>{item.lastMessage}</Text>
        </View>
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}><Text style={styles.unreadText}>{item.unreadCount}</Text></View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
      <View style={styles.topTabs}>
        {[
          { name: "Chats", route: "/" as const },
          { name: "Status", route: "/status" as const },
          { name: "Calls", route: "/call-history" as const },
        ].map(tab => (
          <TouchableOpacity key={tab.name} onPress={() => router.push(tab.route)}>
            <Text style={path === tab.route ? styles.activeTab : styles.inactiveTab}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Chats</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={{ marginRight: 10 }}><Phone size={24} color="#fff" /></TouchableOpacity>
          <TouchableOpacity><MoreVertical size={24} color="#fff" /></TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput placeholder="Search" style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} />
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
  topTabs: { flexDirection: "row", justifyContent: "space-around", paddingTop: 50, paddingBottom: 10, backgroundColor: "#10B981" },
  activeTab: { color: "#fff", fontWeight: "bold", fontSize: 16, borderBottomWidth: 2, borderBottomColor: "#fff", paddingBottom: 5 },
  inactiveTab: { color: "#e5e5e5", fontSize: 16, paddingBottom: 5 },
  header: { backgroundColor: "#10B981", paddingHorizontal: 16, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff", marginTop: 8 },
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
