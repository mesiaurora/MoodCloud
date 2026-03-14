import { Text, TextInput, View } from "react-native";

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Username" />
      <TextInput placeholder="Password" secureTextEntry />
    </View>
  );
}

