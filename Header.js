import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title, showBack = false, onBack }) {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity
          onPress={onBack || (() => navigation.goBack())}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  header: {
    backgroundColor: '#A66A6A',
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 16,
    position: 'relative'
  },
  backButton: {
    zIndex: 1 
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 30,
  
  }
});
