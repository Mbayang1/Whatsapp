import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ArrowLeft, Send, Paperclip, Mic } from "lucide-react-native";

interface Message {
  id: string;
  text?: string;
  timestamp: string;
  sender: "me" | "contact";
}

export default function ChatDetailScreen() {
  const { userId } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  const contact = {
    name: "Alex Johnson",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900",
  };

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages = await AsyncStorage.getItem(`messages-${userId}`);
      if (storedMessages) setMessages(JSON.parse(storedMessages));
    };
    loadMessages();
  }, [userId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const newMsg = {
      id: Date.now().toString(),
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sender: "me" as const,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    await AsyncStorage.setItem(`messages-${userId}`, JSON.stringify(updated));
    setMessage("");
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.contactInfo}>
          <Image source={{ uri: contact.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{contact.name}</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollViewRef} style={styles.messagesContainer} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}>
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
  header: { flexDirection: "row", alignItems: "center", paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, backgroundColor: "#10B981" },
  contactInfo: { flexDirection: "row", alignItems: "center", marginLeft: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  name: { color: "#fff", fontWeight: "bold", fontSize: 16 },
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
