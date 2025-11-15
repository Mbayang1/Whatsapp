import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import { Search, ArrowLeft, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Contact { id: string; name: string; avatar: string; status: string; isSelected: boolean; }

const mockContacts: Contact[] = [
  { id: '1', name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900', status: 'Online', isSelected: false },
  { id: '2', name: 'Sarah Miller', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900', status: 'Offline', isSelected: false },
  { id: '3', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900', status: 'Online', isSelected: false },
];

const NewChatScreen = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchQuery, setSearchQuery] = useState('');

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
    <TouchableOpacity className="flex-row items-center p-3 border-b border-gray-100" onPress={() => toggleContactSelection(item.id)}>
      <View className="relative">
        <Image source={{ uri: item.avatar }} className="w-12 h-12 rounded-full mr-3" />
        {item.isSelected && (
          <View className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-6 h-6 items-center justify-center">
            <Check size={16} color="white" />
          </View>
        )}
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
        <Text className={`text-sm ${item.status === 'Online' ? 'text-green-500' : 'text-gray-500'}`}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="bg-green-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity className="flex-row items-center" onPress={() => router.back()}>
            <ArrowLeft size={24} color="white" />
            <Text className="text-xl font-bold text-white ml-4">New Chat</Text>
          </TouchableOpacity>
          {selectedCount > 0 && (
            <TouchableOpacity className="bg-white rounded-full px-4 py-2" onPress={handleCreateNewChat}>
              <Text className="text-green-500 font-semibold">Next</Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row items-center bg-white rounded-full px-4 py-2">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search contacts"
            className="flex-1 ml-2 text-gray-700"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={renderContactItem}
        keyExtractor={item => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NewChatScreen;
