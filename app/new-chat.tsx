import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { Search, ArrowLeft, Check } from "lucide-react-native";
import { useRouter } from "expo-router";

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  isSelected: boolean;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900", status: "Online", isSelected: false },
  { id: "2", name: "Sarah Miller", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900", status: "Offline", isSelected: false },
  { id: "3", name: "Michael Chen", avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900", status: "Online", isSelected: false },
];

export default function NewChatScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleContactSelection = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, isSelected: !c.isSelected } : c));
  };

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedCount = contacts.filter(c => c.isSelected).length;

  const handleCreateNewChat = () => {
    const selected = contacts.filter(c => c.isSelected);
    if (selected.length) router.push(`/chat-detail?userId=${selected[0].id}`);
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity style={styles.contactRow} onPress={() => toggleContactSelection(item.id)}>
      <View style={{ position: "relative" }}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isSelected && (
          <View style={styles.selectedBadge}>
            <Check size={16} color="#fff" />
          </View>
        )}
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={[styles.contactStatus, { color: item.status === "Online" ? "#10B981" : "#6B7280" }]}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#fff" />
            <Text style={styles.headerTitle}>New Chat</Text>
          </TouchableOpacity>
          {selectedCount > 0 && (
            <TouchableOpacity style={styles.nextButton} onPress={handleCreateNewChat}>
              <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search contacts"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#10B981", paddingTop: 50, paddingHorizontal: 16, paddingBottom: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backRow: { flexDirection: "row", alignItems: "center" },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold", marginLeft: 8 },
  nextButton: { backgroundColor: "#fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  nextText: { color: "#10B981", fontWeight: "600" },
  searchContainer: { flexDirection: "row", backgroundColor: "#fff", padding: 8, borderRadius: 8, marginTop: 12, alignItems: "center" },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  contactRow: { flexDirection: "row", alignItems: "center", padding: 12, borderBottomWidth: 0.5, borderColor: "#E5E7EB" },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  selectedBadge: { position: "absolute", bottom: -2, right: -2, backgroundColor: "#10B981", width: 22, height: 22, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  contactName: { fontWeight: "600", fontSize: 16 },
  contactStatus: { fontSize: 14 },
});
