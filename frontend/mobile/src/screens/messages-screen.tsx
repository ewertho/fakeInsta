import { StyleSheet, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export function MessagesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Feather name="search" size={18} color="#737373" style={styles.searchIcon} />
        <TextInput
          placeholder="Pesquisar"
          placeholderTextColor="#737373"
          style={styles.search}
          editable={false}
        />
      </View>
      <Text style={styles.section}>Mensagens</Text>
      <Text style={styles.hint}>
        Conecte-se à API com login para ver conversas reais em uma próxima versão.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  search: {
    flex: 1,
    color: "#fff",
    paddingVertical: 10,
    fontSize: 15,
  },
  section: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
  },
  hint: {
    color: "#a8a8a8",
    fontSize: 14,
    lineHeight: 20,
  },
});
