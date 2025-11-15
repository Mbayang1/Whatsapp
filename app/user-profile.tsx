import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, Bell, User, Key, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function UserProfile() {
  const router = useRouter();
  const user = { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900", status: "Available for work" };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Info</Text>
      </View>

      <ScrollView>
        <View style={styles.userSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userStatus}>{user.status}</Text>
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionRow}>
            <Bell size={22} />
            <Text style={styles.optionText}>Mute Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <User size={22} />
            <Text style={styles.optionText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Key size={22} />
            <Text style={styles.optionText}>Encryption</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.optionRow, { marginTop: 20 }]}>
            <Trash2 size={22} color="red" />
            <Text style={[styles.optionText, { color: "red" }]}>Delete Chat</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { flexDirection: "row", alignItems: "center", paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12 },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 16 },
  userSection: { alignItems: "center", paddingVertical: 20, backgroundColor: "#fff", margin: 8, borderRadius: 12 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 22, fontWeight: "600", marginTop: 8 },
  userStatus: { fontSize: 14, color: "#6B7280", marginTop: 4 },
  optionsSection: { marginTop: 16, paddingHorizontal: 16 },
  optionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 16, borderBottomWidth: 0.3, borderColor: "#ccc" },
  optionText: { marginLeft: 12, fontSize: 16 },
});
