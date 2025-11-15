import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { ArrowLeft, Send, Paperclip, Mic } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: string;
  text?: string;
  image?: string;
  contact?: { name: string; phoneNumber: string };
  timestamp: string;
  sender: 'me' | 'contact';
  status?: 'sent' | 'read';
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState("");
  const { userId } = useLocalSearchParams();

  const contact = { name: "Alex Johnson", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900", isOnline: true, lastSeen: "2 hours ago" };
  const [messages, setMessages] = useState([
    { id: "1", text: "Hey!", sender: "contact", timestamp: "10:30 AM", status: "read" },
    { id: "2", text: "Hi, how are you?", sender: "me", timestamp: "10:31 AM", status: "read" },
  ]);

  const ChatDetailScreen = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');

  // Load messages when the screen mounts or when userId changes
  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncStorage.getItem(`messages-${userId}`);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
    };
    loadMessages();
  }, [userId]);

  // ...rest of your ChatDetailScreen code
};

  const sendMessage = () => {
    if (message.trim() === "") return;
    setMessages([...messages, { id: Date.now().toString(), text: message, sender: "me", timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), status: "sent" }]);
    setMessage("");
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.status}>{contact.isOnline ? "Online" : `Last seen ${contact.lastSeen}`}</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
          {messages.map(msg => (
            <View key={msg.id} style={[styles.messageBubble, msg.sender === "me" ? styles.myMessage : styles.contactMessage]}>
              <Text style={msg.sender === "me" ? styles.myText : styles.contactText}>{msg.text}</Text>
              <Text style={styles.timestamp}>{msg.timestamp}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TouchableOpacity>
            <Paperclip size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            placeholder="Type a message"
            value={message}
            onChangeText={setMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage}>
            {message.trim() === "" ? <Mic size={24} color="#fff" /> : <Send size={24} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  header: { backgroundColor: "#10B981", flexDirection: "row", alignItems: "center", padding: 12, paddingTop: 50 },
  contactInfo: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  name: { fontWeight: "bold", fontSize: 16, color: "#fff" },
  status: { fontSize: 12, color: "#D1FAE5" },
  messagesContainer: { flex: 1, padding: 12 },
  messageBubble: { padding: 10, borderRadius: 12, marginVertical: 4, maxWidth: "80%" },
  myMessage: { backgroundColor: "#10B981", alignSelf: "flex-end", borderTopRightRadius: 0 },
  contactMessage: { backgroundColor: "#fff", alignSelf: "flex-start", borderTopLeftRadius: 0 },
  myText: { color: "#fff" },
  contactText: { color: "#111" },
  timestamp: { fontSize: 10, color: "#6B7280", marginTop: 2, alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "#fff" },
  input: { flex: 1, backgroundColor: "#F3F4F6", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginHorizontal: 8 },
});
